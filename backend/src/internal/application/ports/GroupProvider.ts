import type { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import type { ExternalGroup } from '../models/ExternalGroup.js';

export interface FetchExternalGroupQuery {
  filters: {
    externalId: string;
  };
}

export interface FetchExternalGroupsQuery {
  filters: {
    externalIds?: string[];
    active?: boolean;
  };
  page?: {
    limit?: number;
    skip?: number;
  };
}

export interface GroupProvider {
  fetch(
    credentials: TenantCredentials,
    query: FetchExternalGroupQuery,
  ): Promise<ExternalGroup | null>;
  fetchMany(
    credentials: TenantCredentials,
    query: FetchExternalGroupsQuery,
  ): Promise<ExternalGroup[]>;
}
