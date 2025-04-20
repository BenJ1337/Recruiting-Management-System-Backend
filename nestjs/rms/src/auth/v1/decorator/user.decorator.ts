import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserDto } from '../domain';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDto => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user as UserDto;
  },
);
