export class SubscriptionInvoiceActionForbiddenException extends Error {
  constructor(
    message = 'You are not allowed to access this subscription invoice.',
  ) {
    super(message);
    this.name = SubscriptionInvoiceActionForbiddenException.name;
  }
}
