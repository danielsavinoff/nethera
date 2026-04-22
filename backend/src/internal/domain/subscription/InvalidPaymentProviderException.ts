export class InvalidPaymentProviderException extends Error {
  constructor(provider: string) {
    super(`Invalid payment provider: ${provider}.`);
    this.name = InvalidPaymentProviderException.name;
  }
}
