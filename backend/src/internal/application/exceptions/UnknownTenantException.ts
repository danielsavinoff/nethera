export class UnknownTenantException extends Error {
  constructor(message = 'Bitrix tenant not found.') {
    super(message);
    this.name = UnknownTenantException.name;
  }
}
