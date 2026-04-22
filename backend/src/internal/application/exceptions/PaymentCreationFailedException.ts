export class PaymentCreationFailedException extends Error {
  constructor(message = 'Payment creation failed.') {
    super(message);
    this.name = PaymentCreationFailedException.name;
  }
}
