export class VpnSubscriptionNotFoundException extends Error {
  constructor() {
    super('VPN subscription does not exist.');
    this.name = VpnSubscriptionNotFoundException.name;
  }
}
