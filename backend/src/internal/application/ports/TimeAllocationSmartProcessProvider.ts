import type { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import type { ExternalTimeAllocation } from '../models/ExternalTimeAllocation.js';
import type { Page } from '../models/Page.js';

export interface FetchTimeAllocationsSmartProcessQuery {
  filters: {
    userId: string;
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
  fetchMany(
    credentials: TenantCredentials,
    smartProcessExternalId: string,
    query: FetchTimeAllocationsSmartProcessQuery,
  ): Promise<Page<ExternalTimeAllocation>>;
}
