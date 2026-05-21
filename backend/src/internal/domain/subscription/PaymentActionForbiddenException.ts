export class PaymentActionForbiddenException extends Error {
  constructor(
    message = 'You are not allowed to access this payment.',
  ) {
    super(message);
    this.name = PaymentActionForbiddenException.name;
  }
}
