/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../entities/user-role.entity';
import { ROLES_KEY } from '../access-control/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determine if the user can activate the route handler.
   *
   * It will check if the user has at least one of the roles specified in the
   * `@Roles` decorator.
   *
   * If no roles are specified, it will automatically allow the request.
   *
   * @param context The execution context of the request.
   * @returns `true` if the user can activate the route, `false` otherwise.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Allow if no roles are specified
    }

    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) =>
      user.roles?.some((userRole) => userRole.role === role),
    );
  }
}
