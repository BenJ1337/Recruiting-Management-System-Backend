import { Module } from '@nestjs/common';
import { LoginService, LoginController } from './v1';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
})
export class AuthV1Module { }
