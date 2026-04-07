import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import { ProviderIdentity } from '../models/ProviderIdentity.js';

export interface OauthProvider {
  getIdentity(ctx: TenantCredentials): Promise<ProviderIdentity>;
}
