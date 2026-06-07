import { ApiProperty } from '@nestjs/swagger';
import { KycStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ReviewKycDocumentDto {
  @ApiProperty({ enum: [KycStatus.VERIFIED, KycStatus.REJECTED] })
  @IsEnum(KycStatus)
  status: KycStatus;
}
