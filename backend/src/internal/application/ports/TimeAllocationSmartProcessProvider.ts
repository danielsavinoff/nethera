import type { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import type { ExternalTimeAllocation } from '../models/ExternalTimeAllocation.js';
import type { Page } from '../models/Page.js';

export interface FetchExternalTimeAllocationQuery {
  filters: {
    externalId: string;
  };
}

export interface FetchTimeAllocationsSmartProcessQuery {
  filters: {
    externalUserId: string;
    year: number;
    weekNumber?: number;
    weekNumberFrom?: number;
    weekNumberTo?: number;
  };
  page?: {
    limit?: number;
    skip?: number;
  };
}

export interface TimeAllocationSmartProcessProvider {
  fetchOrThrow(
    credentials: TenantCredentials,
    externalSmartProcessId: string,
    query: FetchExternalTimeAllocationQuery,
  ): Promise<ExternalTimeAllocation>;
  fetchMany(
    credentials: TenantCredentials,
    externalSmartProcessId: string,
    query: FetchTimeAllocationsSmartProcessQuery,
  ): Promise<Page<ExternalTimeAllocation>>;
}
