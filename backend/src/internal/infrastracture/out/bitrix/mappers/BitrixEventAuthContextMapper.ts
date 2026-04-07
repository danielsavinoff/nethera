import { HandlerAuthParams } from '@bitrix24/b24jssdk';
import { Injectable } from '@nestjs/common';
import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { BitrixAuthContextMissingException } from '../exceptions/BitrixAuthContextMissingException.js';
import { Tenant } from '../../../../../internal/domain/tenant/Tenant.js';

export interface EventAuthContextInput {
  auth?: HandlerAuthParams;
  tenant?: Tenant;
}

@Injectable()
export class BitrixEventAuthContextMapper {
  map({
    auth,
    tenant,
  }: EventAuthContextInput): TenantCredentials {
    if (!tenant && !auth) {
      throw new BitrixAuthContextMissingException();
    }

    const clientEndpointFallback = `https://${auth?.domain}/rest`;

    if (!tenant) {
      const accessToken = auth?.access_token;
      const refreshToken = auth?.refresh_token;
      const expiresIn = auth?.expires_in;
      const memberId = auth?.member_id;
      const domain = auth?.domain;

      if (
        typeof accessToken != 'string' ||
        typeof refreshToken != 'string' ||
        typeof expiresIn !== 'string' ||
        typeof memberId !== 'string' ||
        typeof domain !== 'string'
      ) {
        throw new BitrixAuthContextMissingException();
      }

      return TenantCredentials.hydrate({
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: Number(expiresIn),
        memberId: memberId,
        domain: domain,
        clientEndpoint: clientEndpointFallback,
      });
    }

    return tenant.credentials;
  }
}
