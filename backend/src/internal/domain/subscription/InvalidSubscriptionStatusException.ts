export class InvalidSubscriptionStatusException extends Error {
  constructor(value: string) {
    super(`Subscription status "${value}" is not supported.`);
    this.name = InvalidSubscriptionStatusException.name;
  }
}
