import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { jwtAccessTtlSeconds, jwtSecret } from '../auth/auth.constants';
import { MatchesController } from './matches.controller';
import { SocialGateway } from './social.gateway';
import { SocialService } from './social.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: jwtAccessTtlSeconds },
    }),
  ],
  controllers: [MatchesController],
  providers: [SocialGateway, SocialService],
})
export class SocialModule {}
