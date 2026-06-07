import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/auth.types';
import { RequestKycUploadDto } from './dto/request-kyc-upload.dto';
import { ReviewKycDocumentDto } from './dto/review-kyc-document.dto';
import { KycService } from './kyc.service';

@ApiTags('kyc')
@ApiBearerAuth()
@Controller('api/v1/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('upload-intents')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Gera URL de upload documental para KYC.' })
  @ApiResponse({ status: 201, description: 'Intent de upload criada.' })
  createUploadIntent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RequestKycUploadDto,
  ) {
    return this.kycService.createUploadIntent(user, dto);
  }

  @Patch('documents/:documentId/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Revisa documento KYC. Restrito a administradores.',
  })
  reviewDocument(
    @Param('documentId') documentId: string,
    @Body() dto: ReviewKycDocumentDto,
  ) {
    return this.kycService.reviewDocument(documentId, dto);
  }
}
