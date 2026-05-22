export class UnsupportedIntervalException extends Error {
  constructor(message = 'Unsupported interval.') {
    super(message);
    this.name = UnsupportedIntervalException.name;
  }
}
