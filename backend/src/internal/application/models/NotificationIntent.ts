import type {
  NotificationChannel,
  NotificationType,
} from './Notification.js';
import { NotificationRecipientByChannel } from './NotificationRecipientByChannel.js';
import type { NotificationSubjectByType } from './NotificationSubjectByType.js';

export interface NotificationIntent<
  T extends NotificationType = NotificationType,
  C extends NotificationChannel = NotificationChannel,
> {
  channel: C;
  recipient: NotificationRecipientByChannel[C];
  subject?: NotificationSubjectByType[T];
}
