export class UnknownCurrencyException extends Error {
  constructor() {
    super(`Unknown currency provided.`);
    this.name = UnknownCurrencyException.name;
  }
}
