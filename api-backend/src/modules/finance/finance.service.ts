import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentStatus, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { IuguWebhookDto } from './dto/iugu-webhook.dto';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createReservation(user: AuthenticatedUser, dto: CreateReservationDto) {
    return this.prisma.$transaction(async (tx) => {
      const room = await tx.room.findFirst({
        where: {
          id: dto.roomId,
          republic: {
            deletedAt: null,
          },
        },
        include: {
          republic: true,
        },
      });

      if (!room) {
        throw new NotFoundException('Quarto nao encontrado.');
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

      const splitRule = await tx.splitRule.findFirst({
        where: {
          activeFrom: {
            lte: new Date(),
          },
          OR: [{ activeUntil: null }, { activeUntil: { gt: new Date() } }],
        },
        orderBy: {
          activeFrom: 'desc',
        },
      });

      const platformFeePct =
        splitRule?.platformFeePct ??
        new Prisma.Decimal(process.env.DEFAULT_PLATFORM_FEE_PCT ?? 10);
      const platformFee = grossValue
        .mul(platformFeePct)
        .div(100)
        .toDecimalPlaces(2);
      const netValue = grossValue.minus(platformFee).toDecimalPlaces(2);
      const invoiceId = `sandbox-${randomUUID()}`;

      const reservation = await tx.reservation.create({
        data: {
          studentId: user.id,
          roomId: room.id,
          grossValue,
          platformFee,
          netValue,
          iuguInvoiceId: invoiceId,
          iuguPixCode: `pix-uai-quartos:${invoiceId}`,
          status: PaymentStatus.PENDING,
        },
      });

      return {
        reservationId: reservation.id,
        roomId: room.id,
        status: reservation.status,
        pricing: {
          grossValue: Number(reservation.grossValue),
          platformFee: Number(reservation.platformFee),
          netValue: Number(reservation.netValue),
          platformFeePct: Number(platformFeePct),
        },
        payment: {
          provider: 'IUGU_SANDBOX',
          invoiceId,
          pixCode: reservation.iuguPixCode,
        },
      };
    });
  }

  async handleIuguWebhook(payload: IuguWebhookDto) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { iuguInvoiceId: payload.id },
    });

    if (!reservation) {
      return {
        status: 'ignored',
        reason: 'reservation_not_found',
      };
    }

    if (reservation.status === PaymentStatus.PAID) {
      return {
        status: 'ignored',
        reason: 'already_paid',
        reservationId: reservation.id,
      };
    }

    const nextStatus = this.mapIuguEvent(payload.event);

    return this.prisma.$transaction(async (tx) => {
      const updatedReservation = await tx.reservation.update({
        where: { id: reservation.id },
        data: {
          status: nextStatus,
          paidAt: nextStatus === PaymentStatus.PAID ? new Date() : undefined,
        },
      });

      if (
        nextStatus === PaymentStatus.FAILED ||
        nextStatus === PaymentStatus.REFUNDED
      ) {
        await tx.room.update({
          where: { id: reservation.roomId },
          data: { isAvailable: true },
        });
      }

      return {
        status: 'processed',
        reservationId: updatedReservation.id,
        paymentStatus: updatedReservation.status,
      };
    });
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

    if (['failed', 'canceled', 'invoice.failed'].includes(normalizedEvent)) {
      return PaymentStatus.FAILED;
    }

    return PaymentStatus.PROCESSING;
  }
}
