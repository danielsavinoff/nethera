import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import type { TenantCredentialsRenewer } from '../../../../application/ports/TenantCredentialsRenewer.js';
import { Injectable } from '@nestjs/common';
import { BitrixClient } from '../clients/BitrixClient.js';

@Injectable()
export class BitrixTenantCredentialsRenewer
  implements TenantCredentialsRenewer
{
  constructor(private readonly bitrixClient: BitrixClient) {}

  async renew(
    expiredCredentials: TenantCredentials,
  ): Promise<TenantCredentials> {
    const credentials = await this.bitrixClient.refresh(
      expiredCredentials,
    );

    return TenantCredentials.hydrate({
      accessToken: credentials.access_token,
      refreshToken: credentials.refresh_token,
      domain: credentials.domain,
      expiresIn: credentials.expires_in,
      memberId: credentials.member_id,
      clientEndpoint: expiredCredentials.clientEndpoint,
    });
  }
}
