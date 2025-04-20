import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginService } from '../login';
import { Strategy } from 'passport-local';
import { UserDto } from '../domain';
import { PassportStrategy } from '@nestjs/passport';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly loginService: LoginService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super();
  }
  async validate(username: string, password: string): Promise<UserDto> {
    const validUser: UserDto = await this.loginService.validateUser({
      username: username,
      password: password,
    });
    if (!validUser) {
      throw new UnauthorizedException();
    }
    return validUser;
  }
}
