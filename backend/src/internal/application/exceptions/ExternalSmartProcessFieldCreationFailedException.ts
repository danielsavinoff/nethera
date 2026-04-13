export class ExternalSmartProcessFieldCreationFailedException extends Error {
  constructor(
    message = 'External smart process field creation failed.',
  ) {
    super(message);
    this.name =
      ExternalSmartProcessFieldCreationFailedException.name;
  }
}
