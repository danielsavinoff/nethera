export class SubscriptionPlanNotLoadedException extends Error {
  constructor() {
    super('Subscription plan is not loaded.');
    this.name = SubscriptionPlanNotLoadedException.name;
  }
}
