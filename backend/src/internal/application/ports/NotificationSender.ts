import { Credentials } from '../models/Credentials.js';
import type { Notification } from '../models/Notification.js';

export interface NotificationSender {
  send(
    notification: Notification,
    credentials?: Credentials,
  ): Promise<void>;
}
