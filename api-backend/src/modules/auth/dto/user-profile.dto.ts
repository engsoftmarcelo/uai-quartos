import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min, IsBoolean } from 'class-validator';

export class UserProfileDto {
  @ApiProperty({ example: 4, description: 'Nível de silêncio (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  noiseTolerance: number;

  @ApiProperty({ example: true, description: 'Fumante?' })
  @IsBoolean()
  isSmoker: boolean;

  @ApiProperty({ example: 2, description: 'Frequência de visitas (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  guestFrequency: number;
}
