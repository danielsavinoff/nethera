export class EventSubscriptionFailedException extends Error {
  constructor(
    message = 'Subscription to Bitrix events failed.',
  ) {
    super(message);
    this.name = EventSubscriptionFailedException.name;
  }
}
