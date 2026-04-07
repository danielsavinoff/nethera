export class UserRoleAssignmentNotFoundException extends Error {
  constructor(message = 'User role assignment was not found.') {
    super(message);
    this.name = UserRoleAssignmentNotFoundException.name;
  }
}
