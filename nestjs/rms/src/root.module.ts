import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { Console } from 'winston/lib/winston/transports';
import * as winston from 'winston';
import { RmsV1Module } from './v1/rmsv1.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot({
      format: winston.format.cli(),
      transports: [new Console()],
    }),
    RmsV1Module,
  ],
})
export class RootModule { }
