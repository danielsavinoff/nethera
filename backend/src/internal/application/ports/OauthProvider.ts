import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import { ExternalIdentity } from '../models/ExternalIdentity.js';

export interface OauthProvider {
  fetchIdentity(
    ctx: TenantCredentials,
  ): Promise<ExternalIdentity>;
}
