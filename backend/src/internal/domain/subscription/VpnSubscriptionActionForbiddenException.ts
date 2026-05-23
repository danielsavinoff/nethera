export class VpnSubscriptionActionForbiddenException extends Error {
  constructor(
    message = 'You are not allowed to access this VPN subscription.',
  ) {
    super(message);
    this.name = VpnSubscriptionActionForbiddenException.name;
  }
}
