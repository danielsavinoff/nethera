import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';

export interface TenantCredentialsRenewer {
  renew(
    expiredCredentials: TenantCredentials,
  ): Promise<TenantCredentials>;
}
