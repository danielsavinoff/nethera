export class SubscriptionPlanActionForbiddenException extends Error {
  constructor(
    message = 'Subscription plan action is forbidden.',
  ) {
    super(message);
    this.name = SubscriptionPlanActionForbiddenException.name;
  }
}
