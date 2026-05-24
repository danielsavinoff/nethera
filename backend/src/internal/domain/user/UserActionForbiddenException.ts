export class UserActionForbiddenException extends Error {
  constructor(
    message = 'You are not allowed to access this user.',
  ) {
    super(message);
    this.name = UserActionForbiddenException.name;
  }
}
