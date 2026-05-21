export class InvalidInvoiceStatusException extends Error {
  constructor(value: string) {
    super(`Invoice status "${value}" is not supported.`);
    this.name = InvalidInvoiceStatusException.name;
  }
}
