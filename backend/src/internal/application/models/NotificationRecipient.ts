import type { NotificationChannel } from './Notification.js';
import type { NotificationRecipientByChannel } from './NotificationRecipientByChannel.js';

export type NotificationRecipient<
  T extends NotificationChannel = NotificationChannel,
> = NotificationRecipientByChannel[T];
