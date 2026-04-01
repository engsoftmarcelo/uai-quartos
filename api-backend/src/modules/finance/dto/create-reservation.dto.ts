import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 'uuid-do-quarto', description: 'ID do quarto desejado' })
  @IsUUID()
  roomId: string;

  @ApiProperty({ example: 1200.00, description: 'Valor total da reserva' })
  @IsNumber()
  amount: number;
}