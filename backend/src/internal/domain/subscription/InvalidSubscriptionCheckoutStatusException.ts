export class InvalidSubscriptionCheckoutStatusException extends Error {
  constructor(value: string) {
    super(
      `Subscription checkout status "${value}" is not supported.`,
    );
    this.name = InvalidSubscriptionCheckoutStatusException.name;
  }
}
