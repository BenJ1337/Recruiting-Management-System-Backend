import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { Console } from 'winston/lib/winston/transports';
import * as winston from 'winston';
import { RecruitingManagementSystemModule } from './rms/rms.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      format: winston.format.cli(),
      transports: [new Console()],
    }),
    RecruitingManagementSystemModule,
    AuthModule,
  ],
})
export class RootModule {}
