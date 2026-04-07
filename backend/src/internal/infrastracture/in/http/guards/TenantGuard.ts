import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaTenantRepository } from '../../../out/persistence/repositories/PrismaTenantRepository.js';

interface TenantGuardRequestBody {
  auth?: {
    member_id?: string;
  };
  memberId?: string;
}

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly tenantRepository: PrismaTenantRepository,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const type = context.getType();

    if (type !== 'http') {
      throw new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest<Request>();

    const body = request.body as
      | TenantGuardRequestBody
      | undefined;

    const memberId = body?.auth?.member_id || body?.memberId;

    if (typeof memberId !== 'string' || memberId.length === 0) {
      throw new UnauthorizedException();
    }

    const tenant =
      await this.tenantRepository.loadByMemberId(memberId);

    if (!tenant) throw new UnauthorizedException();

    request['tenant'] = tenant;

    return true;
  }
}
