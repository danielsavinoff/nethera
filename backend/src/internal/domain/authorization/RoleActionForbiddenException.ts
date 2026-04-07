export class RoleActionForbiddenException extends Error {
  constructor(
    message = 'You do not have permission to manage user roles.',
  ) {
    super(message);
    this.name = RoleActionForbiddenException.name;
  }
}
