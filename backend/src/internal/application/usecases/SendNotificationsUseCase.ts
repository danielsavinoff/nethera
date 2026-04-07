import { NotificationChannelNotSupportedException } from '../exceptions/NotificationChannelNotSupportedException.js';
import type {
  Notification,
  NotificationChannel,
} from '../models/Notification.js';
import type { NotificationSender } from '../ports/NotificationSender.js';
import { Credentials } from '../models/Credentials.js';

export class SendNotificationsUseCase {
  constructor(
    private readonly notificationChannels: Record<
      NotificationChannel,
      NotificationSender
    >,
  ) {}

  async execute(
    notifications: Notification[],
    credentials?: Credentials,
  ) {
    for (const notification of notifications) {
      const channel =
        this.notificationChannels[notification.channel];

      if (!channel) {
        throw new NotificationChannelNotSupportedException();
      }

      await channel.send(notification, credentials);
    }
  }
}
