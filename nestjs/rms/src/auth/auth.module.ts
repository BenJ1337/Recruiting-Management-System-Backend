import { Module } from '@nestjs/common';
import { LoginService, LoginController } from './v1';
import { LoginStrategy, JwtStrategy } from './v1/strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './v1/guard/jwt.guard';

@Module({
  controllers: [LoginController],
  providers: [
    LoginService,
    LoginStrategy,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtGuard }, // APP_GUARD provides JwtGuard gloably
  ],
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(
            configService.getOrThrow<string>(
              'ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC',
            ),
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
