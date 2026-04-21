export class InvalidPlanBillingIntervalException extends Error {
  constructor(value: string) {
    super(`Plan billing interval "${value}" is not supported.`);
    this.name = InvalidPlanBillingIntervalException.name;
  }
}
