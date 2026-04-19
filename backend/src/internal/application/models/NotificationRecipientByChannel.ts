import type { NotificationChannel } from './Notification.js';

export interface NotificationRecipientByChannel {
  [NotificationChannel.Email]: {
    email: string;
  };
}
