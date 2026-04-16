export class TenantTimeAllocationSmartProcessNotFoundException extends Error {
  constructor() {
    super('Tenant time allocation smart process not found');
    this.name =
      TenantTimeAllocationSmartProcessNotFoundException.name;
  }
}
