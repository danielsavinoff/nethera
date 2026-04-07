export class SessionNotFoundException extends Error {
  constructor(message = 'Session is not found.') {
    super(message);
    this.name = SessionNotFoundException.name;
  }
}
