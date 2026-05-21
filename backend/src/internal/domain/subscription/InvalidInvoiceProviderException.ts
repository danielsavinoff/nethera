export class InvalidInvoiceProviderException extends Error {
  constructor(provider: string) {
    super(`Invalid invoice provider: ${provider}.`);
    this.name = InvalidInvoiceProviderException.name;
  }
}
