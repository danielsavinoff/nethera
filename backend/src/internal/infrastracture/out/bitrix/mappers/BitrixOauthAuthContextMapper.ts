import { Injectable } from '@nestjs/common';
import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { Tenant } from '../../../../domain/tenant/Tenant.js';

export interface Auth {
  accessToken: string;
  refreshToken: string;
  expires: number;
  expiresIn: number;
  domain: string;
  memberId: string;
}

export interface OauthAuthContextInput {
  auth: Auth;
  tenant?: Tenant;
}

@Injectable()
export class BitrixOauthAuthContextMapper {
  map({
    auth,
    tenant,
  }: OauthAuthContextInput): TenantCredentials {
    const clientEndpointFallback = `https://${auth.domain}/rest`;

    return TenantCredentials.hydrate({
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      expiresIn: auth.expiresIn,
      memberId: auth.memberId,
      domain: auth.domain,
      clientEndpoint:
        tenant?.credentials.clientEndpoint ??
        clientEndpointFallback,
    });
  }
}
