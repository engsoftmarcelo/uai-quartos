import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateRepublicDto } from './dto/create-republic.dto';
import { PropertyMediaUploadDto } from './dto/property-media-upload.dto';
import { RepublicResponseDto } from './dto/republic-response.dto';
import { SearchRepublicDto } from './dto/search-republic.dto';
import { UpdateRepublicDto } from './dto/update-republic.dto';
import { RepublicsService } from './republics.service';

@ApiTags('properties')
@Controller('api/v1/properties')
export class RepublicsController {
  constructor(private readonly republicsService: RepublicsService) {}

  @Get()
  @ApiOperation({
    summary: 'Busca republicas por raio e filtros geoespaciais.',
  })
  @ApiResponse({ status: 200, type: [RepublicResponseDto] })
  findAll(@Query() query: SearchRepublicDto): Promise<RepublicResponseDto[]> {
    return this.republicsService.findNearby(query);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista inventario do locador autenticado.' })
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.republicsService.findMine(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalha uma republica ativa.' })
  async findOne(@Param('id') id: string) {
    const property = await this.republicsService.findById(id);

    if (!property) {
      throw new NotFoundException('Republica nao encontrada.');
    }

    return property;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cadastra republica com quartos e coordenadas.' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateRepublicDto,
  ) {
    return this.republicsService.create(user, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza metadados e coordenadas da republica.' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateRepublicDto,
  ) {
    return this.republicsService.update(id, user, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desativa republica via soft delete.' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.republicsService.remove(id, user);
  }

  @Post(':id/media-upload-intents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gera URL de upload de foto da propriedade.' })
  createMediaUploadIntent(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: PropertyMediaUploadDto,
  ) {
    return this.republicsService.createMediaUploadIntent(id, user, dto);
  }
}
