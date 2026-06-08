import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  LedgerAccount,
  LedgerDirection,
  LegalAgreementStatus,
  PaymentStatus,
  Prisma,
  ProviderEventStatus,
  RecipientStatus,
  Role,
  SplitCalculationType,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { ClicksignWebhookDto } from './dto/clicksign-webhook.dto';
import { ConfigureRecipientDto } from './dto/configure-recipient.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { IuguWebhookDto } from './dto/iugu-webhook.dto';
import { ClicksignService } from './clicksign.service';
import { IuguGatewayService } from './iugu-gateway.service';

const reservationFinanceInclude = Prisma.validator<Prisma.ReservationInclude>()(
  {
    room: {
      include: {
        republic: {
          include: {
            owner: true,
          },
        },
      },
    },
    student: true,
    splitRule: true,
    paymentSplit: {
      include: {
        recipient: true,
      },
    },
    legalAgreement: true,
    ledgerEntries: {
      orderBy: { createdAt: 'asc' },
    },
    webhookEvents: {
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
  },
);

type ReservationWithFinance = Prisma.ReservationGetPayload<{
  include: typeof reservationFinanceInclude;
}>;

type TransactionClient = Prisma.TransactionClient;

@Injectable()
export class FinanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly iuguGateway: IuguGatewayService,
    private readonly clicksignService: ClicksignService,
  ) {}

  async createReservation(user: AuthenticatedUser, dto: CreateReservationDto) {
    if (dto.idempotencyKey) {
      const existing = await this.prisma.reservation.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
        include: reservationFinanceInclude,
      });

      if (existing) {
        if (existing.studentId !== user.id) {
          throw new ConflictException('Chave idempotente ja utilizada.');
        }

        return this.toReservationDossier(existing);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const room = await tx.room.findFirst({
        where: {
          id: dto.roomId,
          republic: {
            deletedAt: null,
          },
        },
        include: {
          republic: {
            include: {
              owner: true,
            },
          },
        },
      });

      if (!room) {
        throw new NotFoundException('Quarto nao encontrado.');
      }

      if (room.republic.ownerId === user.id) {
        throw new ForbiddenException(
          'O locador nao pode reservar o proprio quarto.',
        );
      }

      if (!room.isAvailable) {
        throw new ConflictException(
          'Este quarto ja esta em processo de reserva.',
        );
      }

      const grossValue = new Prisma.Decimal(room.basePrice);

      if (
        dto.amount !== undefined &&
        !new Prisma.Decimal(dto.amount).equals(grossValue)
      ) {
        throw new BadRequestException(
          'Valor divergente do preco atual do quarto.',
        );
      }

      const lockResult = await tx.room.updateMany({
        where: {
          id: dto.roomId,
          isAvailable: true,
        },
        data: {
          isAvailable: false,
        },
      });

      if (lockResult.count !== 1) {
        throw new ConflictException('Reserva concorrente detectada.');
      }

      const splitRule = await this.findActiveSplitRule(tx);
      const platformFeePct =
        splitRule?.platformFeePct ??
        new Prisma.Decimal(process.env.DEFAULT_PLATFORM_FEE_PCT ?? 10);
      const platformFee = grossValue
        .mul(platformFeePct)
        .div(100)
        .toDecimalPlaces(2);
      const netValue = grossValue.minus(platformFee).toDecimalPlaces(2);
      const recipient = await this.ensureRecipient(tx, room.republic.owner);
      const reservationId = randomUUID();
      const paymentIntent = this.iuguGateway.createPixIntent({
        grossValue,
        platformFee,
        netValue,
        platformFeePct,
        recipientAccountId: recipient.providerAccountId,
        reservationId,
      });

      const reservation = await tx.reservation.create({
        data: {
          id: reservationId,
          studentId: user.id,
          roomId: room.id,
          splitRuleId: splitRule?.id,
          grossValue,
          platformFee,
          netValue,
          idempotencyKey: dto.idempotencyKey,
          iuguInvoiceId: paymentIntent.invoiceId,
          iuguPixCode: paymentIntent.pixCode,
          iuguSplitPayload:
            paymentIntent.splitPayload as Prisma.InputJsonObject,
          paymentExpiresAt: paymentIntent.expiresAt,
          status: PaymentStatus.PENDING,
        },
      });

      await tx.paymentSplit.create({
        data: {
          reservationId: reservation.id,
          recipientId: recipient.id,
          splitRuleId: splitRule?.id,
          calculationType: SplitCalculationType.PERCENTAGE,
          platformFeePct,
          platformAmount: platformFee,
          landlordAmount: netValue,
          providerPayload: paymentIntent.splitPayload as Prisma.InputJsonObject,
        },
      });

      await this.createLedgerEntries(tx, reservation.id, 'intent-created', [
        {
          account: LedgerAccount.STUDENT_RECEIVABLE,
          direction: LedgerDirection.DEBIT,
          amount: grossValue,
          description: 'Compromisso financeiro aberto pelo checkout Pix.',
        },
      ]);

      const withFinance = await tx.reservation.findUniqueOrThrow({
        where: { id: reservation.id },
        include: reservationFinanceInclude,
      });

      return this.toReservationDossier(withFinance);
    });
  }

  getRecipient(user: AuthenticatedUser) {
    return this.prisma.paymentRecipient.findUnique({
      where: { userId: user.id },
    });
  }

  async upsertRecipient(user: AuthenticatedUser, dto: ConfigureRecipientDto) {
    const providerAccountId =
      dto.providerAccountId?.trim() ?? `iugu-recipient-${user.id.slice(0, 8)}`;

    return this.prisma.paymentRecipient.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        providerAccountId,
        legalName: dto.legalName.trim(),
        document: this.onlyDigits(dto.document),
        bankCode: dto.bankCode?.trim(),
        agency: dto.agency?.trim(),
        accountNumber: dto.accountNumber?.trim(),
        pixKey: dto.pixKey?.trim(),
        status: RecipientStatus.ACTIVE,
      },
      update: {
        providerAccountId,
        legalName: dto.legalName.trim(),
        document: this.onlyDigits(dto.document),
        bankCode: dto.bankCode?.trim(),
        agency: dto.agency?.trim(),
        accountNumber: dto.accountNumber?.trim(),
        pixKey: dto.pixKey?.trim(),
        status: RecipientStatus.ACTIVE,
      },
    });
  }

  async listReservations(user: AuthenticatedUser) {
    const reservations = await this.prisma.reservation.findMany({
      where: this.reservationScope(user),
      include: reservationFinanceInclude,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return reservations.map((reservation) =>
      this.toReservationDossier(reservation),
    );
  }

  async getReservationDossier(user: AuthenticatedUser, reservationId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: reservationFinanceInclude,
    });

    if (!reservation) {
      throw new NotFoundException('Reserva nao encontrada.');
    }

    this.assertCanReadReservation(user, reservation);
    return this.toReservationDossier(reservation);
  }

  async handleIuguWebhook(payload: IuguWebhookDto, signature?: string) {
    this.iuguGateway.assertWebhookSignature(payload, signature);

    const eventKey = this.eventKey('IUGU', payload.id, payload.event, payload);
    const reservation = await this.prisma.reservation.findUnique({
      where: { iuguInvoiceId: payload.id },
      include: reservationFinanceInclude,
    });

    const webhookEvent = await this.createWebhookEvent({
      provider: 'IUGU',
      eventKey,
      eventType: payload.event,
      payload,
      signature,
      reservationId: reservation?.id,
    });

    if (!webhookEvent) {
      return {
        status: 'ignored',
        reason: 'duplicate_event',
        eventKey,
      };
    }

    if (!reservation) {
      await this.markWebhookEvent(webhookEvent.id, ProviderEventStatus.IGNORED);
      return {
        status: 'ignored',
        reason: 'reservation_not_found',
        eventKey,
      };
    }

    const nextStatus = this.mapIuguEvent(payload.event);

    if (nextStatus === PaymentStatus.PAID) {
      return this.processPaidReservation(
        reservation,
        webhookEvent.id,
        eventKey,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedReservation = await tx.reservation.update({
        where: { id: reservation.id },
        data: {
          status: nextStatus,
        },
        include: reservationFinanceInclude,
      });

      if (
        nextStatus === PaymentStatus.FAILED ||
        nextStatus === PaymentStatus.REFUNDED ||
        nextStatus === PaymentStatus.CANCELED
      ) {
        await tx.room.update({
          where: { id: reservation.roomId },
          data: { isAvailable: true },
        });
      }

      await tx.financeWebhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          status: ProviderEventStatus.PROCESSED,
          processedAt: new Date(),
        },
      });

      return {
        status: 'processed',
        reservationId: updatedReservation.id,
        paymentStatus: updatedReservation.status,
      };
    });
  }

  async handleClicksignWebhook(
    payload: ClicksignWebhookDto,
    signature?: string,
  ) {
    this.clicksignService.assertWebhookSignature(payload, signature);

    const eventKey = this.eventKey(
      'CLICKSIGN',
      payload.documentId,
      payload.event,
      payload,
    );
    const agreement = await this.prisma.legalAgreement.findFirst({
      where: {
        OR: [
          { providerDocumentId: payload.documentId },
          { documentKey: payload.documentKey },
        ],
      },
      include: {
        reservation: true,
      },
    });
    const webhookEvent = await this.createWebhookEvent({
      provider: 'CLICKSIGN',
      eventKey,
      eventType: payload.event,
      payload,
      signature,
      reservationId: agreement?.reservationId,
    });

    if (!webhookEvent) {
      return {
        status: 'ignored',
        reason: 'duplicate_event',
        eventKey,
      };
    }

    if (!agreement) {
      await this.markWebhookEvent(webhookEvent.id, ProviderEventStatus.IGNORED);
      return {
        status: 'ignored',
        reason: 'agreement_not_found',
        eventKey,
      };
    }

    const normalizedEvent = payload.event.toLowerCase();
    const isSigned = ['signed', 'document.signed'].includes(normalizedEvent);
    const isCanceled = ['canceled', 'cancelled', 'document.canceled'].includes(
      normalizedEvent,
    );

    return this.prisma.$transaction(async (tx) => {
      const legalStatus = isSigned
        ? LegalAgreementStatus.SIGNED
        : isCanceled
          ? LegalAgreementStatus.CANCELED
          : agreement.status;
      const reservationStatus = isSigned
        ? PaymentStatus.CONTRACT_SIGNED
        : isCanceled
          ? PaymentStatus.CANCELED
          : agreement.reservation.status;

      await tx.legalAgreement.update({
        where: { id: agreement.id },
        data: {
          status: legalStatus,
          signedAt: isSigned ? new Date() : undefined,
        },
      });
      const reservation = await tx.reservation.update({
        where: { id: agreement.reservationId },
        data: { status: reservationStatus },
        include: reservationFinanceInclude,
      });

      if (isSigned) {
        await this.createLedgerEntries(tx, reservation.id, eventKey, [
          {
            account: LedgerAccount.CONTRACT_ESCROW,
            direction: LedgerDirection.CREDIT,
            amount: reservation.grossValue,
            description: 'Contrato juridico assinado e liberado para ocupacao.',
          },
        ]);
      }

      await tx.financeWebhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          status: ProviderEventStatus.PROCESSED,
          processedAt: new Date(),
        },
      });

      return {
        status: 'processed',
        reservationId: reservation.id,
        paymentStatus: reservation.status,
        contractStatus: legalStatus,
      };
    });
  }

  private async processPaidReservation(
    reservation: ReservationWithFinance,
    webhookEventId: string,
    eventKey: string,
  ) {
    const advancedStatuses: PaymentStatus[] = [
      PaymentStatus.CONTRACT_PENDING,
      PaymentStatus.CONTRACT_SIGNED,
      PaymentStatus.SETTLED,
    ];

    if (advancedStatuses.includes(reservation.status)) {
      await this.markWebhookEvent(webhookEventId, ProviderEventStatus.IGNORED);
      return {
        status: 'ignored',
        reason: 'reservation_already_advanced',
        reservationId: reservation.id,
      };
    }

    const agreement = this.clicksignService.createLeaseAgreement({
      reservationId: reservation.id,
      propertyName: reservation.room.republic.name,
      studentEmail: reservation.student.email,
      studentName: reservation.student.name,
      landlordEmail: reservation.room.republic.owner.email,
      landlordName: reservation.room.republic.owner.name,
      grossValue: Number(reservation.grossValue),
      netValue: Number(reservation.netValue),
    });

    return this.prisma.$transaction(async (tx) => {
      const updatedReservation = await tx.reservation.update({
        where: { id: reservation.id },
        data: {
          status: PaymentStatus.CONTRACT_PENDING,
          paidAt: reservation.paidAt ?? new Date(),
        },
        include: reservationFinanceInclude,
      });

      await this.createLedgerEntries(tx, reservation.id, eventKey, [
        {
          account: LedgerAccount.IUGU_CLEARING,
          direction: LedgerDirection.DEBIT,
          amount: reservation.grossValue,
          description: 'Liquidacao Pix recebida no gateway Iugu.',
        },
        {
          account: LedgerAccount.PLATFORM_REVENUE,
          direction: LedgerDirection.CREDIT,
          amount: reservation.platformFee,
          description: 'Receita operacional da plataforma via split.',
        },
        {
          account: LedgerAccount.LANDLORD_PAYABLE,
          direction: LedgerDirection.CREDIT,
          amount: reservation.netValue,
          description: 'Recebivel liquido destinado ao locador.',
        },
      ]);

      await tx.legalAgreement.upsert({
        where: { reservationId: reservation.id },
        create: {
          reservationId: reservation.id,
          providerDocumentId: agreement.providerDocumentId,
          documentKey: agreement.documentKey,
          signatureRequestUrl: agreement.signatureRequestUrl,
          studentEmail: reservation.student.email,
          landlordEmail: reservation.room.republic.owner.email,
          payload: agreement.payload as Prisma.InputJsonObject,
          status: LegalAgreementStatus.SENT,
        },
        update: {
          status: LegalAgreementStatus.SENT,
          signatureRequestUrl: agreement.signatureRequestUrl,
          payload: agreement.payload as Prisma.InputJsonObject,
        },
      });

      await tx.financeWebhookEvent.update({
        where: { id: webhookEventId },
        data: {
          status: ProviderEventStatus.PROCESSED,
          processedAt: new Date(),
        },
      });

      return {
        status: 'processed',
        reservationId: updatedReservation.id,
        paymentStatus: updatedReservation.status,
        contract: {
          provider: 'CLICKSIGN_SANDBOX',
          documentKey: agreement.documentKey,
          signatureRequestUrl: agreement.signatureRequestUrl,
        },
      };
    });
  }

  private async ensureRecipient(
    tx: TransactionClient,
    landlord: { id: string; name: string; email: string },
  ) {
    const existing = await tx.paymentRecipient.findUnique({
      where: { userId: landlord.id },
    });

    if (existing) {
      if (existing.status === RecipientStatus.SUSPENDED) {
        throw new ConflictException('Conta de repasse do locador suspensa.');
      }

      return existing;
    }

    return tx.paymentRecipient.create({
      data: {
        userId: landlord.id,
        providerAccountId: `iugu-recipient-${landlord.id.slice(0, 8)}`,
        legalName: landlord.name,
        document: `sandbox-${landlord.id.slice(0, 8)}`,
        pixKey: landlord.email,
        status: RecipientStatus.ACTIVE,
      },
    });
  }

  private findActiveSplitRule(tx: TransactionClient) {
    const now = new Date();

    return tx.splitRule.findFirst({
      where: {
        activeFrom: { lte: now },
        OR: [{ activeUntil: null }, { activeUntil: { gt: now } }],
      },
      orderBy: { activeFrom: 'desc' },
    });
  }

  private createLedgerEntries(
    tx: TransactionClient,
    reservationId: string,
    eventKey: string,
    entries: Array<{
      account: LedgerAccount;
      direction: LedgerDirection;
      amount: Prisma.Decimal;
      description: string;
    }>,
  ) {
    return tx.ledgerEntry.createMany({
      data: entries.map((entry) => ({
        id: randomUUID(),
        reservationId,
        account: entry.account,
        direction: entry.direction,
        amount: entry.amount,
        idempotencyKey: `${eventKey}:${entry.account}:${entry.direction}`,
        description: entry.description,
        metadata: { eventKey },
      })),
      skipDuplicates: true,
    });
  }

  private async createWebhookEvent(input: {
    provider: string;
    eventKey: string;
    eventType: string;
    payload: unknown;
    signature?: string;
    reservationId?: string;
  }) {
    try {
      return await this.prisma.financeWebhookEvent.create({
        data: {
          provider: input.provider,
          eventKey: input.eventKey,
          eventType: input.eventType,
          payload: input.payload as Prisma.InputJsonObject,
          signature: input.signature,
          reservationId: input.reservationId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return null;
      }

      throw error;
    }
  }

  private markWebhookEvent(id: string, status: ProviderEventStatus) {
    return this.prisma.financeWebhookEvent.update({
      where: { id },
      data: {
        status,
        processedAt: new Date(),
      },
    });
  }

  private reservationScope(
    user: AuthenticatedUser,
  ): Prisma.ReservationWhereInput {
    if (user.role === Role.ADMIN) {
      return {};
    }

    if (user.role === Role.LANDLORD) {
      return {
        room: {
          republic: {
            ownerId: user.id,
          },
        },
      };
    }

    return { studentId: user.id };
  }

  private assertCanReadReservation(
    user: AuthenticatedUser,
    reservation: ReservationWithFinance,
  ) {
    const isParticipant =
      reservation.studentId === user.id ||
      reservation.room.republic.ownerId === user.id;

    if (user.role !== Role.ADMIN && !isParticipant) {
      throw new ForbiddenException('Reserva indisponivel para este usuario.');
    }
  }

  private mapIuguEvent(event: string): PaymentStatus {
    const normalizedEvent = event.toLowerCase();

    if (['paid', 'invoice.paid'].includes(normalizedEvent)) {
      return PaymentStatus.PAID;
    }

    if (['processing', 'invoice.processing'].includes(normalizedEvent)) {
      return PaymentStatus.PROCESSING;
    }

    if (['refunded', 'invoice.refunded'].includes(normalizedEvent)) {
      return PaymentStatus.REFUNDED;
    }

    if (
      ['canceled', 'cancelled', 'invoice.canceled'].includes(normalizedEvent)
    ) {
      return PaymentStatus.CANCELED;
    }

    if (['failed', 'invoice.failed'].includes(normalizedEvent)) {
      return PaymentStatus.FAILED;
    }

    return PaymentStatus.PROCESSING;
  }

  private eventKey(
    provider: string,
    resourceId: string,
    event: string,
    payload: { data?: Record<string, unknown> },
  ): string {
    const explicitKey =
      payload.data?.eventKey ??
      payload.data?.event_key ??
      payload.data?.idempotencyKey ??
      payload.data?.idempotency_key;
    const normalizedKey =
      typeof explicitKey === 'string' ||
      typeof explicitKey === 'number' ||
      typeof explicitKey === 'boolean'
        ? String(explicitKey)
        : 'default';

    return `${provider}:${resourceId}:${event}:${normalizedKey}`;
  }

  private toReservationDossier(reservation: ReservationWithFinance) {
    return {
      id: reservation.id,
      roomId: reservation.roomId,
      propertyName: reservation.room.republic.name,
      roomTitle: reservation.room.title,
      student: {
        id: reservation.studentId,
        email: reservation.student.email,
        name: reservation.student.name,
      },
      landlord: {
        id: reservation.room.republic.ownerId,
        email: reservation.room.republic.owner.email,
        name: reservation.room.republic.owner.name,
      },
      status: reservation.status,
      createdAt: reservation.createdAt,
      paidAt: reservation.paidAt,
      paymentExpiresAt: reservation.paymentExpiresAt,
      pricing: {
        grossValue: Number(reservation.grossValue),
        platformFee: Number(reservation.platformFee),
        netValue: Number(reservation.netValue),
        platformFeePct: Number(
          reservation.paymentSplit?.platformFeePct ??
            reservation.splitRule?.platformFeePct ??
            0,
        ),
      },
      payment: {
        provider: 'IUGU_SANDBOX',
        invoiceId: reservation.iuguInvoiceId,
        pixCode: reservation.iuguPixCode,
        splitPayload: reservation.iuguSplitPayload,
      },
      split: reservation.paymentSplit
        ? {
            calculationType: reservation.paymentSplit.calculationType,
            platformAmount: Number(reservation.paymentSplit.platformAmount),
            landlordAmount: Number(reservation.paymentSplit.landlordAmount),
            recipient: {
              id: reservation.paymentSplit.recipient.id,
              providerAccountId:
                reservation.paymentSplit.recipient.providerAccountId,
              legalName: reservation.paymentSplit.recipient.legalName,
              status: reservation.paymentSplit.recipient.status,
            },
          }
        : null,
      contract: reservation.legalAgreement
        ? {
            id: reservation.legalAgreement.id,
            provider: reservation.legalAgreement.provider,
            documentKey: reservation.legalAgreement.documentKey,
            providerDocumentId: reservation.legalAgreement.providerDocumentId,
            status: reservation.legalAgreement.status,
            signatureRequestUrl: reservation.legalAgreement.signatureRequestUrl,
            sentAt: reservation.legalAgreement.sentAt,
            signedAt: reservation.legalAgreement.signedAt,
          }
        : null,
      ledger: reservation.ledgerEntries.map((entry) => ({
        id: entry.id,
        account: entry.account,
        direction: entry.direction,
        amount: Number(entry.amount),
        currency: entry.currency,
        description: entry.description,
        createdAt: entry.createdAt,
      })),
      webhookEvents: reservation.webhookEvents.map((event) => ({
        id: event.id,
        provider: event.provider,
        eventKey: event.eventKey,
        eventType: event.eventType,
        status: event.status,
        processedAt: event.processedAt,
        createdAt: event.createdAt,
      })),
    };
  }

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }
}
