export class ExternalSmartProcessCreationFailedException extends Error {
  constructor(
    message = 'External smart process creation failed.',
  ) {
    super(message);
    this.name =
      ExternalSmartProcessCreationFailedException.name;
  }
}
