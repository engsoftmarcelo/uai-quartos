import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth') // Agrupa no Swagger sob a tag "auth"
@Controller('api/v1/auth')
export class AuthController {
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza o login de estudantes ou locadores' })
  @ApiResponse({ status: 200, description: 'Autenticação realizada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    // A lógica de serviço entrará aqui nos próximos passos
    return { message: 'Contrato validado com sucesso', data: loginDto };
  }
}