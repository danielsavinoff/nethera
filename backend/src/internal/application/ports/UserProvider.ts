import type { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import type { ExternalUser } from '../models/ExternalUser.js';

export interface FetchExternalUsersQuery {
  filters?: {
    externalIds?: number[];
    departmentExternalId?: string;
  };
  page?: {
    limit?: number;
    skip?: number;
  };
}

export interface FetchExternalUserQuery {
  filters: {
    externalId: number;
  };
}

export interface UserProvider {
  fetchAll(
    credentials: TenantCredentials,
    query: FetchExternalUsersQuery,
  ): Promise<ExternalUser[]>;
  fetchOneOrThrow(
    credentials: TenantCredentials,
    query: FetchExternalUserQuery,
  ): Promise<ExternalUser>;
  fetchMe(credentials: TenantCredentials): Promise<ExternalUser>;
}
