export class InvalidPaymentStatusException extends Error {
  constructor(value: string) {
    super(`Payment status "${value}" is not supported.`);
    this.name = InvalidPaymentStatusException.name;
  }
}
