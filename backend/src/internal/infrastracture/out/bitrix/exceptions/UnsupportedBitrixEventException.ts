export class UnsupportedBitrixEventException extends Error {
  constructor(message = 'Bitrix event is not supported.') {
    super(message);
    this.name = UnsupportedBitrixEventException.name;
  }
}
