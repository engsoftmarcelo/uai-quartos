import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { KycStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { RequestKycUploadDto } from './dto/request-kyc-upload.dto';
import { ReviewKycDocumentDto } from './dto/review-kyc-document.dto';

@Injectable()
export class KycService {
  constructor(private readonly prisma: PrismaService) {}

  async createUploadIntent(user: AuthenticatedUser, dto: RequestKycUploadDto) {
    const storageKey = this.buildStorageKey(user.id, dto.filename);
    const document = await this.prisma.kycDocument.create({
      data: {
        userId: user.id,
        documentType: dto.documentType,
        storageKey,
        filename: dto.filename,
        contentType: dto.contentType,
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { kycStatus: KycStatus.PENDING },
    });

    const uploadBaseUrl =
      process.env.KYC_UPLOAD_BASE_URL?.replace(/\/$/, '') ??
      'https://storage.uai-quartos.local';

    return {
      documentId: document.id,
      method: 'PUT',
      uploadUrl: `${uploadBaseUrl}/${storageKey}`,
      storageKey,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    };
  }

  async reviewDocument(documentId: string, dto: ReviewKycDocumentDto) {
    if (dto.status === KycStatus.PENDING) {
      throw new BadRequestException(
        'A revisao deve aprovar ou rejeitar o documento.',
      );
    }

    const document = await this.prisma.kycDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Documento KYC nao encontrado.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedDocument = await tx.kycDocument.update({
        where: { id: documentId },
        data: {
          status: dto.status,
          reviewedAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: document.userId },
        data: {
          kycStatus: dto.status,
        },
      });

      return updatedDocument;
    });
  }

  private buildStorageKey(userId: string, filename: string): string {
    const extension = filename
      .split('.')
      .pop()
      ?.replace(/[^a-z0-9]/gi, '');
    const suffix = extension ? `.${extension.toLowerCase()}` : '';

    return `kyc/${userId}/${randomUUID()}${suffix}`;
  }
}
