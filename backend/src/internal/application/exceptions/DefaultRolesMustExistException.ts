export class DefaultRolesMustExistException extends Error {
  constructor() {
    super(
      'Default roles must exist in the system. Please ensure that the default roles are properly seeded in the database.',
    );
    this.name = DefaultRolesMustExistException.name;
  }
}
