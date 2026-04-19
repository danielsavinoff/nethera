import type { NotificationType } from './Notification.js';

export interface NotificationSubjectByType {
  [NotificationType.Auth]: {
    link: string;
  };
  [NotificationType.SubscriptionExpiresSoon]: {
    expiresAt: Date;
  };
}
