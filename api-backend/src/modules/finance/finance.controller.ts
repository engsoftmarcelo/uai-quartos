import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ConfigureRecipientDto } from './dto/configure-recipient.dto';
import { FinanceService } from './finance.service';

@ApiTags('finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('recipient/me')
  @Roles(Role.LANDLORD, Role.ADMIN)
  @ApiOperation({ summary: 'Consulta subconta de repasse Iugu sandbox.' })
  getMyRecipient(@CurrentUser() user: AuthenticatedUser) {
    return this.financeService.getRecipient(user);
  }

  @Put('recipient/me')
  @Roles(Role.LANDLORD, Role.ADMIN)
  @ApiOperation({ summary: 'Configura recipient/subconta de repasse.' })
  upsertMyRecipient(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ConfigureRecipientDto,
  ) {
    return this.financeService.upsertRecipient(user, dto);
  }

  @Get('reservations')
  @Roles(Role.STUDENT, Role.LANDLORD, Role.ADMIN)
  @ApiOperation({ summary: 'Lista reservas financeiras visiveis ao usuario.' })
  listReservations(@CurrentUser() user: AuthenticatedUser) {
    return this.financeService.listReservations(user);
  }

  @Get('reservations/:reservationId/dossier')
  @Roles(Role.STUDENT, Role.LANDLORD, Role.ADMIN)
  @ApiOperation({ summary: 'Retorna dossie financeiro, ledger e contrato.' })
  getReservationDossier(
    @CurrentUser() user: AuthenticatedUser,
    @Param('reservationId') reservationId: string,
  ) {
    return this.financeService.getReservationDossier(user, reservationId);
  }
}
