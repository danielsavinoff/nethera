import type {
  Notification,
  NotificationChannel,
  NotificationType,
} from '../models/Notification.js';
import type { NotificationIntent } from '../models/NotificationIntent.js';

export interface NotificationComposer<
  T extends NotificationType = NotificationType,
> {
  compose<C extends NotificationChannel = NotificationChannel>(
    intent: NotificationIntent<T, C>,
  ): Notification;
}
