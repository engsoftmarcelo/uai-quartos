import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'marcelo@pucminas.br',
    description: 'E-mail institucional ou pessoal do usuário',
  })
  @IsEmail({}, { message: 'O e-mail informado deve ser válido' })
  @IsNotEmpty({ message: 'O campo e-mail é obrigatório' })
  email: string;

  @ApiProperty({
    example: 'Senha@123',
    description: 'Senha de acesso do usuário',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'O campo senha é obrigatório' })
  @MinLength(8, { message: 'A senha deve conter no mínimo 8 caracteres' })
  password: string;
}