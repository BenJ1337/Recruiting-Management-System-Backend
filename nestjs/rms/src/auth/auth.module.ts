import { Module } from '@nestjs/common';
import { LoginService, LoginController } from './v1';
import { LoginStrategy, JwtStrategy } from './v1/strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [LoginController],
  providers: [LoginService, LoginStrategy, JwtStrategy],
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: '123', //configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: 360 /*parseInt(
            configService.getOrThrow<string>(
              'ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC',
            ),
          )*/,
        },
        inject: [ConfigService],
      }),
    }),
  ],
  exports: [JwtModule, JwtStrategy],
})
export class AuthV1Module {}
