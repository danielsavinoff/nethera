export class SubscriptionNotFoundException extends Error {
  constructor(message = 'Subscription was not found.') {
    super(message);
    this.name = SubscriptionNotFoundException.name;
  }
}
