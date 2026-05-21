export class SubscriptionPlanNotFoundException extends Error {
  constructor(message = 'Subscription plan was not found.') {
    super(message);
    this.name = SubscriptionPlanNotFoundException.name;
  }
}
