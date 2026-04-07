export class UserRolesNotLoadedException extends Error {
  constructor() {
    super(
      'User roles are not loaded. Cannot check permissions.',
    );
    this.name = UserRolesNotLoadedException.name;
  }
}
