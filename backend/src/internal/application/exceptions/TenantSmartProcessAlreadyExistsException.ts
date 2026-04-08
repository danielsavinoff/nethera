export class TenantSmartProcessAlreadyExistsException extends Error {
  constructor(message = 'Tenant already has a smart process.') {
    super(message);
    this.name = TenantSmartProcessAlreadyExistsException.name;
  }
}
