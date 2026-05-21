export class SubscriptionPriceNotFoundException extends Error {
  constructor(message = 'Subscription price was not found.') {
    super(message);
    this.name = SubscriptionPriceNotFoundException.name;
  }
}
