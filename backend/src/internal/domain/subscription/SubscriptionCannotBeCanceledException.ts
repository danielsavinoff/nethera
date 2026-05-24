export class SubscriptionCannotBeCanceledException extends Error {
  constructor(message = 'Subscription cannot be canceled.') {
    super(message);
    this.name = SubscriptionCannotBeCanceledException.name;
  }
}
