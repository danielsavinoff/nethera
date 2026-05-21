export class InvoiceCreationFailedException extends Error {
  constructor(message = 'Invoice creation failed.') {
    super(message);
    this.name = InvoiceCreationFailedException.name;
  }
}
