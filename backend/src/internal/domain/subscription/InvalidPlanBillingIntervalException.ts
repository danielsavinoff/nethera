export class InvalidPlanBillingIntervalException extends Error {
  constructor(value: string) {
    super(
      `SubscriptionPlan billing interval "${value}" is not supported.`,
    );
    this.name = InvalidPlanBillingIntervalException.name;
  }
}
