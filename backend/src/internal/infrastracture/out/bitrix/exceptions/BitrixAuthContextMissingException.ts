export class BitrixAuthContextMissingException extends Error {
  constructor(message = 'Bitrix auth context is missing.') {
    super(message);
    this.name = BitrixAuthContextMissingException.name;
  }
}
