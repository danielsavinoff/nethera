import type { NotificationRecipient } from './NotificationRecipient.js';

export enum NotificationType {
  Auth = 'AUTH',
  SubscriptionExpiresSoon = 'SUBSCRIPTION_EXPIRES_SOON',
}

export enum NotificationChannel {
  Email = 'email',
}

export type NotificationContent =
  | NotificationTextContent
  | NotificationMarkupContent;

export interface NotificationTextContent {
  text?: string;
}

export interface NotificationMarkupContent {
  markup?: string;
}

export interface Notification<
  C extends NotificationContent = NotificationContent,
> {
  channel: NotificationChannel;
  recipient: NotificationRecipient;
  subject?: string;
  content: C;
}
