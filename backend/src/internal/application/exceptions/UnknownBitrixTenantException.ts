export class UnknownBitrixTenantException extends Error {
  constructor(message = 'Bitrix tenant not found.') {
    super(message);
    this.name = UnknownBitrixTenantException.name;
  }
}
