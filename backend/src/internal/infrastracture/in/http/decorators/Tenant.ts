import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Tenant as DomainTenant } from '../../../../domain/tenant/Tenant.js';

export const Tenant = createParamDecorator(
  (
    data: keyof DomainTenant | undefined,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    const tenant = request['tenant'] as DomainTenant;

    return data ? tenant?.[data] : tenant;
  },
);

export const TenantDecorator = Tenant;
