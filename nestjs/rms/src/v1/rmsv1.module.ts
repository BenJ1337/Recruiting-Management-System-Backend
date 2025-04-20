import { Module } from '@nestjs/common';
import { JobPostingController as JobPostingController } from './jobposting/jobposting.controller';
import { JobPostingService as JobPostingService } from './jobposting/jobposting.service';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { Console } from 'winston/lib/winston/transports';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot({
      format: winston.format.cli(),
      transports: [new Console()],
    }),
  ],
  controllers: [JobPostingController],
  providers: [JobPostingService],
})
export class RmsV1Module { }
