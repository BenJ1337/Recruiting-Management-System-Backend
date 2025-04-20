import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { Console } from 'winston/lib/winston/transports';
import * as winston from 'winston';
import { RecruitingManagementSystemModule } from './rms/rms.module';
import { AuthV1Module } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/v1/guard/jwt.guard';
import { JwtStrategy } from './auth/v1/strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      format: winston.format.cli(),
      transports: [new Console()],
    }),
    RecruitingManagementSystemModule,
    AuthV1Module,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtGuard }, JwtStrategy],
})
export class RootModule {}
