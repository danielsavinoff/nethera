import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import {
  ExternalIdentity,
  Provider,
} from '../../../../application/models/ExternalIdentity.js';
import { OauthProvider } from '../../../../application/ports/OauthProvider.js';
import { BitrixClient } from '../clients/BitrixClient.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BitrixOauthProvider implements OauthProvider {
  constructor(private readonly bitrixClient: BitrixClient) {}

  async fetchIdentity(
    ctx: TenantCredentials,
  ): Promise<ExternalIdentity> {
    const currentUser =
      await this.bitrixClient.getCurrentUser(ctx);

    return {
      externalId: Number(currentUser.ID),
      provider: Provider.Bitrix,
    };
  }
}
