import type { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import type { ExternalUser } from '../models/ExternalUser.js';

export interface UserProvider {
  isAdmin(credentials: TenantCredentials): Promise<boolean>;
  fetchAll(
    credentials: TenantCredentials,
  ): Promise<ExternalUser[]>;
  fetchAllByExternalIds(
    externalIds: number[],
    credentials: TenantCredentials,
  ): Promise<ExternalUser[]>;
  fetchByExternalId(
    externalId: number,
    credentials: TenantCredentials,
  ): Promise<ExternalUser | null>;
  fetchMe(credentials: TenantCredentials): Promise<ExternalUser>;
}
