export class ExternalSmartProcessNotFoundException extends Error {
  constructor(message = 'External smart process not found.') {
    super(message);
    this.name = ExternalSmartProcessNotFoundException.name;
  }
}
