import { NotificationChannelNotSupportedException } from '../exceptions/NotificationChannelNotSupportedException.js';
import type {
  Notification,
  NotificationChannel,
} from '../models/Notification.js';
import type { NotificationService } from '../ports/NotificationService.js';

export class SendNotificationsUseCase {
  constructor(
    private readonly notificationChannels: Record<
      NotificationChannel,
      NotificationService
    >,
  ) {}

  async execute(notifications: Notification[]) {
    for (const notification of notifications) {
      const channel =
        this.notificationChannels[notification.channel];

      if (!channel) {
        throw new NotificationChannelNotSupportedException();
      }

      await channel.send(notification);
    }
  }
}
