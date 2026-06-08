import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { verifyPayloadSignature } from './finance-signature.util';

interface PixIntentInput {
  grossValue: Prisma.Decimal;
  platformFee: Prisma.Decimal;
  netValue: Prisma.Decimal;
  platformFeePct: Prisma.Decimal;
  recipientAccountId: string;
  reservationId: string;
}

export interface PixIntentResult {
  invoiceId: string;
  pixCode: string;
  expiresAt: Date;
  splitPayload: Record<string, unknown>;
}

@Injectable()
export class IuguGatewayService {
  createPixIntent(input: PixIntentInput): PixIntentResult {
    const invoiceId = `sandbox-${randomUUID()}`;
    const expiresAt = new Date(
      Date.now() + Number(process.env.PIX_INTENT_TTL_MINUTES ?? 30) * 60 * 1000,
    );
    const platformAccountId =
      process.env.IUGU_PLATFORM_ACCOUNT_ID ?? 'uai-quartos-platform';
    const grossCents = this.toCents(input.grossValue);
    const platformCents = this.toCents(input.platformFee);
    const landlordCents = this.toCents(input.netValue);

    return {
      invoiceId,
      pixCode: `pix-uai-quartos:${invoiceId}:${grossCents}`,
      expiresAt,
      splitPayload: {
        provider: 'IUGU_SANDBOX',
        invoice_id: invoiceId,
        reservation_id: input.reservationId,
        split_marketplace: [
          {
            recipient_account_id: platformAccountId,
            calculation_type: 'PERCENTAGE',
            percent: Number(input.platformFeePct),
            role: 'platform_fee',
          },
          {
            recipient_account_id: input.recipientAccountId,
            calculation_type: 'PERCENTAGE',
            percent: Number(
              new Prisma.Decimal(100).minus(input.platformFeePct),
            ),
            role: 'landlord_receivable',
          },
        ],
        splits: [
          {
            recipient_account_id: platformAccountId,
            calculation_type: 'FIXED',
            amount_cents: platformCents,
            role: 'platform_fee',
          },
          {
            recipient_account_id: input.recipientAccountId,
            calculation_type: 'FIXED',
            amount_cents: landlordCents,
            role: 'landlord_receivable',
          },
        ],
        amount_cents: grossCents,
        expires_at: expiresAt.toISOString(),
      },
    };
  }

  assertWebhookSignature(payload: unknown, signature?: string): void {
    const secret =
      process.env.IUGU_WEBHOOK_SECRET ?? 'uai-iugu-webhook-dev-secret';

    if (!verifyPayloadSignature(payload, signature, secret)) {
      throw new UnauthorizedException('Assinatura Iugu invalida.');
    }
  }

  private toCents(value: Prisma.Decimal): number {
    return Number(value.mul(100).toDecimalPlaces(0));
  }
}
