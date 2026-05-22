export class InvalidInvoiceLineTypeException extends Error {
  constructor(value: string) {
    super(`Invoice line type "${value}" is not supported.`);
    this.name = InvalidInvoiceLineTypeException.name;
  }
}
