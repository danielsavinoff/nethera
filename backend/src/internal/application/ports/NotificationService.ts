import type { Notification } from '../models/Notification.js';

export interface NotificationService {
  send(notification: Notification): Promise<void>;
}
