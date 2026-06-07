import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiPropertyOptional({
    description:
      'Opcional para clientes nao web. No navegador, o refresh token vem por cookie HttpOnly.',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
