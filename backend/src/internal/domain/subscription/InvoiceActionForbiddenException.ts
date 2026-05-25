export class InvoiceActionForbiddenException extends Error {
  constructor() {
    super('Invoice action is forbidden.');
    this.name = InvoiceActionForbiddenException.name;
  }
}
