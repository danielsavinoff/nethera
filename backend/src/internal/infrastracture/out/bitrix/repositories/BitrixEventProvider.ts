import { Injectable } from '@nestjs/common';
import { EventSubscriptionFailedException } from '../../../../application/exceptions/EventSubscriptionFailedException.js';
import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { EventProvider } from '../../../../application/ports/EventProvider.js';
import { BitrixClient } from '../clients/BitrixClient.js';

@Injectable()
export class BitrixEventProvider implements EventProvider {
  constructor(private readonly bitrixClient: BitrixClient) {}

  async subscribe(
    authContext: TenantCredentials,
  ): Promise<void> {
    const isSubscribed =
      await this.bitrixClient.subscribeTenantToWebhook(
        authContext,
      );

    if (!isSubscribed) {
      throw new EventSubscriptionFailedException();
    }
  }
}
