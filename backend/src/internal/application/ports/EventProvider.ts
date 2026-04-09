import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';

export interface EventProvider {
  subscribe(
    authContext: TenantCredentials,
  ): Promise<void>;
}
