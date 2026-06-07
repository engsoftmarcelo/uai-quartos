import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, Max, Min } from 'class-validator';

export class UserProfileDto {
  @ApiProperty({ example: 3, description: 'Tolerancia a ruido (1-5).' })
  @IsInt()
  @Min(1)
  @Max(5)
  noiseLevel: number;

  @ApiProperty({ example: 5, description: 'Nivel de organizacao (1-5).' })
  @IsInt()
  @Min(1)
  @Max(5)
  organization: number;

  @ApiProperty({ example: 2, description: 'Politica de visitas (1-5).' })
  @IsInt()
  @Min(1)
  @Max(5)
  visitorPolicy: number;

  @ApiProperty({ example: 4, description: 'Rotina de sono (1-5).' })
  @IsInt()
  @Min(1)
  @Max(5)
  sleepRoutine: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isPetFriendly: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  isSmoker: boolean;
}
