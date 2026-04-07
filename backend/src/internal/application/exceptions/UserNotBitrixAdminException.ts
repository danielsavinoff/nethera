export class UserNotBitrixAdminException extends Error {
  constructor(message = 'User is not a Bitrix admin.') {
    super(message);
    this.name = UserNotBitrixAdminException.name;
  }
}
