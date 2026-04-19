export class ComposerNotSupportedException extends Error {
  constructor() {
    super('Composer is not supported.');
    this.name = ComposerNotSupportedException.name;
  }
}
