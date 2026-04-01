import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min, IsBoolean } from 'class-validator';

export class UserProfileDto {
  @ApiProperty({ example: 4, description: 'Nível de tolerância a ruído (1-5)' })
  @IsInt() @Min(1) @Max(5)
  noiseTolerance: number;

  @ApiProperty({ example: false, description: 'O utilizador é fumador?' })
  @IsBoolean()
  isSmoker: boolean;

  @ApiProperty({ example: 2, description: 'Frequência de convidados por semana (1-5)' })
  @IsInt() @Min(1) @Max(5)
  guestFrequency: number;
}