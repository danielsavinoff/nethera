export class UserFavoriteActionForbiddenException extends Error {
  constructor(
    message = 'User favorite action is forbidden.',
  ) {
    super(message);
    this.name = UserFavoriteActionForbiddenException.name;
  }
}
