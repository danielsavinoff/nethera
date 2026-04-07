export class NewUserNotFoundInExternalSystemException extends Error {
  constructor(
    message = 'New user not found in external system.',
  ) {
    super(message);
    this.name = NewUserNotFoundInExternalSystemException.name;
  }
}
