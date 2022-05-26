import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { responseUser } from 'src/users/users.service';

export interface IAuth {
  user: responseUser;
  token: string;
}

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IAuth => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const token = request.cookies;

    return { user, ...token };
  },
);
