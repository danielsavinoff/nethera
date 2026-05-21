export class PaymentNotFoundException extends Error {
  constructor(message = 'Payment was not found.') {
    super(message);
    this.name = PaymentNotFoundException.name;
  }
}
