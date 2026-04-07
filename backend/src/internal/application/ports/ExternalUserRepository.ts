import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import { ExternalUser } from '../models/ExternalUser.js';

export interface ExternalUserRepository {
  isAdmin(credentials: TenantCredentials): Promise<boolean>;
  getAllUsers(
    credentials: TenantCredentials,
  ): Promise<ExternalUser[]>;
  getById(
    externalId: number,
    credentials: TenantCredentials,
  ): Promise<ExternalUser | null>;
  getMe(credentials: TenantCredentials): Promise<ExternalUser>;
}
