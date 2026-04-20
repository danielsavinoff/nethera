export class InvalidInvoiceStatusException extends Error {
  constructor(value: string) {
    super(
      `Subscription invoice status "${value}" is not supported.`,
    );
    this.name = InvalidInvoiceStatusException.name;
  }
}
