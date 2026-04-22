export class PaymentProviderNotSupportedException extends Error {
  constructor(provider: string) {
    super(`Payment provider "${provider}" is not supported.`);
    this.name = PaymentProviderNotSupportedException.name;
  }
}
