export class NotificationChannelNotSupportedException extends Error {
  constructor(
    message = 'Notification channel is not supported.',
  ) {
    super(message);
    this.name = NotificationChannelNotSupportedException.name;
  }
}
