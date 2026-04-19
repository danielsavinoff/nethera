import type { NotificationType } from '../models/Notification.js';
import type { NotificationComposer } from './NotificationComposer.js';

export interface NotificationComposerSelector {
  select<T extends NotificationType = NotificationType>(
    type: T,
  ): NotificationComposer<T>;
}
