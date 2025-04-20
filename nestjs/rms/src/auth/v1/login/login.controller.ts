import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AccessToken, UserDto } from '../domain';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../decorator/public.decorator';

@Public()
@Controller('auth')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(AuthGuard('local')) // Trigger LoginStrategy
  @Post('v1/login')
  async login(
    @Body() user: UserDto,
  ): Promise<AccessToken | BadRequestException> {
    try {
      return await this.loginService.login(user);
    } catch (err) {
      throw new BadRequestException(`Auth failed! ${err.message}`);
    }
  }
}
