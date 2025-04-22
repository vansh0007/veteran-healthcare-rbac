/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class MockRolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
