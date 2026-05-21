export class BillingProviderNotSupportedException extends Error {
  constructor(provider: string) {
    super(`Billing provider "${provider}" is not supported.`);
    this.name = BillingProviderNotSupportedException.name;
  }
}
