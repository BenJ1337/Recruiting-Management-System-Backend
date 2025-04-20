import { Body, Controller, Inject, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from '../domain';

@Controller('api')
export class LoginController {
    constructor(
        private readonly loginService: LoginService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) { }

    @Post('v1/login')
    login(@Body() user: User): void {
        this.logger.info(`User: ${JSON.stringify(user)}`);
    }
}
