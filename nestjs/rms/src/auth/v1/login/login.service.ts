import { Inject, Injectable } from '@nestjs/common';
import { User, AccessToken } from '../domain';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async validateUser(user: User): Promise<User> {
    this.logger.info(`User: ${user}`);
    if (user.username !== 'user') {
      throw new Error('User not found!');
    }
    if (user.password !== '123456') {
      throw new Error('Wrong password!');
    }
    return user;
  }

  async login(user: User): Promise<AccessToken> {
    return { access_token: this.jwtService.sign(user) };
  }
}
