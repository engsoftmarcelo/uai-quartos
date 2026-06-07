import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty({ message: 'O ID do quarto e obrigatorio.' })
  @IsUUID('4', { message: 'O ID do quarto deve ser um UUID V4 valido.' })
  roomId: string;

  @ApiPropertyOptional({
    example: 850.5,
    description:
      'Valor exibido no cliente. O backend valida contra o preco atual do quarto.',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ser um numero valido (ex: 850.50).' },
  )
  @IsPositive({ message: 'O valor financeiro deve ser estritamente positivo.' })
  @Min(100, { message: 'O valor minimo da reserva operacional e R$ 100,00.' })
  amount?: number;
}
