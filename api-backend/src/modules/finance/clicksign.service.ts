import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { verifyPayloadSignature } from './finance-signature.util';

interface AgreementInput {
  reservationId: string;
  propertyName: string;
  studentEmail: string;
  studentName: string;
  landlordEmail: string;
  landlordName: string;
  grossValue: number;
  netValue: number;
}

export interface AgreementResult {
  providerDocumentId: string;
  documentKey: string;
  signatureRequestUrl: string;
  payload: Record<string, unknown>;
}

@Injectable()
export class ClicksignService {
  createLeaseAgreement(input: AgreementInput): AgreementResult {
    const documentKey = `lease-${input.reservationId}`;
    const providerDocumentId = `clicksign-${randomUUID()}`;

    return {
      providerDocumentId,
      documentKey,
      signatureRequestUrl: `https://clicksign.sandbox.uai-quartos.local/sign/${documentKey}`,
      payload: {
        provider: 'CLICKSIGN_SANDBOX',
        endpoint: '/v1/documents',
        document_key: documentKey,
        template: 'uai-quartos-contrato-locacao-v1',
        tags: ['student_signature', 'landlord_signature', 'kyc_reference'],
        signers: [
          {
            name: input.studentName,
            email: input.studentEmail,
            role: 'student',
          },
          {
            name: input.landlordName,
            email: input.landlordEmail,
            role: 'landlord',
          },
        ],
        reservation: {
          id: input.reservationId,
          property_name: input.propertyName,
          gross_value: input.grossValue,
          net_value: input.netValue,
        },
      },
    };
  }

  assertWebhookSignature(payload: unknown, signature?: string): void {
    const secret =
      process.env.CLICKSIGN_WEBHOOK_SECRET ??
      'uai-clicksign-webhook-dev-secret';

    if (!verifyPayloadSignature(payload, signature, secret)) {
      throw new UnauthorizedException('Assinatura Clicksign invalida.');
    }
  }
}
