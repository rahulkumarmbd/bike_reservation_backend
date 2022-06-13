import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { UserService } from 'src/users/users.service';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/userroles';
import { ROLES_KEY } from './RoleGuard';
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly UserService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const data = jwt.verify(
      request.headers.token,
      process.env.JWT_PRIVATE_KEY,
      function (err: any, decoded: { id: number; time: number; iat: number }) {
        if (!err) {
          return decoded;
        }
      },
    );
      console.log(data);
    if (!data) {
      throw new UnauthorizedException();
    }

    return this.isAccessAllowed(data.id, request, context);
  }

  private async isAccessAllowed(userId, request, context) {
    const user = await this.UserService.getOneById(userId);
    request.user = user;
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // console.log(requiredRoles && requiredRoles.includes(user.roles));

    return requiredRoles && requiredRoles.includes(user.roles);
  }
}
