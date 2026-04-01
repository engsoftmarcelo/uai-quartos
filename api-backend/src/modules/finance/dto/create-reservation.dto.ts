import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty({ message: 'O ID do quarto é obrigatório.' })
  @IsUUID('4', { message: 'O ID do quarto deve ser um UUID V4 válido.' })
  roomId: string;

  @ApiProperty({ example: 850.50 })
  @IsNotEmpty({ message: 'O valor da reserva não pode estar vazio.' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser um número válido (ex: 850.50).' })
  @IsPositive({ message: 'O valor financeiro deve ser estritamente positivo.' })
  @Min(100, { message: 'O valor mínimo da reserva operacional é de R$ 100,00.' })
  amount: number;
}