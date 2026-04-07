export class RoleNotFoundException extends Error {
  constructor(message = 'Role was not found.') {
    super(message);
    this.name = RoleNotFoundException.name;
  }
}
