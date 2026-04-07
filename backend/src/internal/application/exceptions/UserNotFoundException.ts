export class UserNotFoundException extends Error {
  constructor(message = 'User is not found.') {
    super(message);
    this.name = UserNotFoundException.name;
  }
}
