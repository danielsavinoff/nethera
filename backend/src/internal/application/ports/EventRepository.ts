import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';

export interface EventRepository {
  subscribeTenantToWebhook(
    authContext: TenantCredentials,
  ): Promise<boolean>;
}
