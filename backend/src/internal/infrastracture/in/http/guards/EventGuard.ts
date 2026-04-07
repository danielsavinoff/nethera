import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Tenant } from '../../../../domain/tenant/Tenant.js';

@Injectable()
export class EventGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const type = context.getType();

    if (type !== 'http') {
      throw new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest<Request>();

    const applicationToken =
      request.body?.auth?.application_token;
    const tenant = request['tenant'] as Tenant;

    if (
      !tenant ||
      (tenant.applicationToken &&
        tenant.applicationToken !== applicationToken)
    ) {
      throw new UnauthorizedException();
    }

    request['tenant'] = tenant;

    return true;
  }
}
