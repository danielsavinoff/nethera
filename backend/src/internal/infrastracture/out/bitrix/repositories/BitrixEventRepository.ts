import { Injectable } from '@nestjs/common';
import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { EventRepository } from '../../../../application/ports/EventRepository.js';
import { BitrixClient } from '../clients/BitrixClient.js';

@Injectable()
export class BitrixEventRepository implements EventRepository {
  constructor(private readonly bitrixClient: BitrixClient) {}

  async subscribeTenantToWebhook(
    authContext: TenantCredentials,
  ): Promise<boolean> {
    return await this.bitrixClient.subscribeTenantToWebhook(
      authContext,
    );
  }
}
