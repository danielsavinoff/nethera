import type { ExternalVpnUsage } from '../models/ExternalVpnUsage.js';
import type {
  And,
  Eq,
  ProviderQuery,
} from '../models/ProviderQuery.js';

export type VpnUsageFilter = And<
  [
    Eq<'externalId', string>,
    Eq<'startDate', Date>,
    Eq<'endDate', Date>,
  ]
>;

export interface VpnUsageProvider {
  fetch(
    query: ProviderQuery<VpnUsageFilter>,
  ): Promise<ExternalVpnUsage>;
}
