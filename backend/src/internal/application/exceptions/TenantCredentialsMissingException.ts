export class TenantCredentialsMissingException extends Error {
  constructor(message = 'Credentials are missing.') {
    super(message);
    this.name = TenantCredentialsMissingException.name;
  }
}
