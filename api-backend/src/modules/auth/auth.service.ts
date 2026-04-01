import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (user && user.password === loginDto.password) {
      // Futuramente aqui entra a geração do JWT (Sábado)
      const { password, ...result } = user;
      return result;
    }
    
    throw new UnauthorizedException('Credenciais inválidas para o portal UAI');
  }
}