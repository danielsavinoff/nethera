export class ExternalUserNotFoundException extends Error {
  constructor(message = 'External user not found.') {
    super(message);
    this.name = ExternalUserNotFoundException.name;
  }
}
