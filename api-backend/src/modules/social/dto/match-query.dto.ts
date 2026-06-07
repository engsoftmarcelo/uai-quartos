import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class MatchQueryDto {
  @ApiPropertyOptional({
    description:
      'Opcional: calcula compatibilidade de uma republica especifica.',
  })
  @IsOptional()
  @IsUUID('4')
  propertyId?: string;
}
