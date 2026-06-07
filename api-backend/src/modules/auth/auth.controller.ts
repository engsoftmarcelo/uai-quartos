import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { REFRESH_TOKEN_COOKIE } from './auth.constants';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedUser, RequestMetadata } from './auth.types';

type RequestWithCookies = {
  cookies?: Record<string, string | undefined>;
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
};

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cria uma conta e inicia sessao segura.' })
  @ApiResponse({ status: 201, description: 'Conta criada e autenticada.' })
  async register(
    @Body() registerDto: RegisterDto,
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(
      registerDto,
      this.getRequestMetadata(request),
    );

    this.setRefreshCookie(
      response,
      result.refreshToken,
      result.refreshTokenExpiresAt,
    );

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza login com e-mail e senha.' })
  @ApiResponse({
    status: 200,
    description: 'Autenticacao realizada com sucesso.',
  })
  @ApiResponse({ status: 401, description: 'Credenciais invalidas.' })
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(
      loginDto,
      this.getRequestMetadata(request),
    );

    this.setRefreshCookie(
      response,
      result.refreshToken,
      result.refreshTokenExpiresAt,
    );

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rotaciona refresh token e emite novo access token.',
  })
  async refreshTokens(
    @Body() body: RefreshTokenDto,
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken =
      request.cookies?.[REFRESH_TOKEN_COOKIE] ?? body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token ausente.');
    }

    const result = await this.authService.refreshTokens(
      refreshToken,
      this.getRequestMetadata(request),
    );

    this.setRefreshCookie(
      response,
      result.refreshToken,
      result.refreshTokenExpiresAt,
    );

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoga a sessao atual e remove o cookie seguro.' })
  async logout(
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.revokeRefreshToken(
      request.cookies?.[REFRESH_TOKEN_COOKIE],
    );
    this.clearRefreshCookie(response);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna a identidade autenticada atual.' })
  me(@CurrentUser() user: AuthenticatedUser) {
    return { user };
  }

  private getRequestMetadata(request: RequestWithCookies): RequestMetadata {
    const userAgent = request.headers['user-agent'];

    return {
      ipAddress: request.ip,
      userAgent: Array.isArray(userAgent) ? userAgent[0] : userAgent,
    };
  }

  private setRefreshCookie(
    response: Response,
    refreshToken: string,
    expires: Date,
  ): void {
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires,
      path: '/api/v1/auth',
    });
  }

  private clearRefreshCookie(response: Response): void {
    response.clearCookie(REFRESH_TOKEN_COOKIE, {
      path: '/api/v1/auth',
    });
  }
}
