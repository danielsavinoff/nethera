import { UserRecord } from '../../domain/user/UserRecord.js';

export enum NotificationChannel {
  CRM = 'crm',
}

export interface NotificationRecipient {
  displayName?: string;
  userId: UserRecord['id'];
  externalId: UserRecord['externalId'];
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
  recipient: NotificationRecipient;
  channel: NotificationChannel;
  content: C;
}
