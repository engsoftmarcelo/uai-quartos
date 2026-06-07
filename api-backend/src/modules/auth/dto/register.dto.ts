import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Marcelo Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O nome e obrigatorio.' })
  @MaxLength(120, { message: 'O nome deve ter no maximo 120 caracteres.' })
  name: string;

  @ApiProperty({ example: 'marcelo@pucminas.br' })
  @IsEmail({}, { message: 'O e-mail informado deve ser valido.' })
  @IsNotEmpty({ message: 'O e-mail e obrigatorio.' })
  email: string;

  @ApiProperty({ example: 'Senha@123', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'A senha deve conter no minimo 8 caracteres.' })
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.STUDENT })
  @IsOptional()
  @IsEnum(Role, { message: 'O papel informado nao existe.' })
  role?: Role;
}
