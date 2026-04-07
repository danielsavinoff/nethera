import type {
  Notification,
  NotificationTextContent,
} from '../../../../application/models/Notification.js';
import type { NotificationSender } from '../../../../application/ports/NotificationSender.js';
import { BitrixClient } from '../clients/BitrixClient.js';
import { Injectable } from '@nestjs/common';
import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';

@Injectable()
export class BitrixNotificationRepository
  implements NotificationSender
{
  constructor(private readonly bitrixClient: BitrixClient) {}

  async send(
    notification: Notification<NotificationTextContent>,
    credentials?: TenantCredentials,
  ): Promise<void> {
    const text = notification.content.text;

    if (!text) {
      return;
    }

    if (!credentials) {
      return;
    }

    await this.bitrixClient.sendNotification(
      notification.recipient.externalId,
      text,
      credentials,
    );
  }
}
