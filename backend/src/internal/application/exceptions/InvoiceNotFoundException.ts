export class InvoiceNotFoundException extends Error {
  constructor() {
    super('Invoice does not exist.');
    this.name = InvoiceNotFoundException.name;
  }
}
