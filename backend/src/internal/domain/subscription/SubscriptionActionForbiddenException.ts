export class SubscriptionActionForbiddenException extends Error {
  constructor(
    message = 'You are not allowed to access this subscription.',
  ) {
    super(message);
    this.name = SubscriptionActionForbiddenException.name;
  }
}
