export class UserFavoriteNotFoundException extends Error {
  constructor(message = 'User favorite is not found.') {
    super(message);
    this.name = UserFavoriteNotFoundException.name;
  }
}
