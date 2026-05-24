import type { ExternalVpnSubscription } from '../models/ExternalVpnSubscription.js';
import type {
  Eq,
  ProviderQuery,
} from '../models/ProviderQuery.js';

export type VpnSubscriptionFilter = Eq<'externalId', string>;

export interface CreateVpnSubscriptionInput {
  userName: string;
  expiresAt?: Date;
}

export interface DeleteVpnSubscriptionInput {
  externalId: string;
}

export interface VpnSubscriptionProvider {
  fetch(
    query: ProviderQuery<VpnSubscriptionFilter>,
  ): Promise<ExternalVpnSubscription | null>;
  create(
    input: CreateVpnSubscriptionInput,
  ): Promise<ExternalVpnSubscription>;
  delete(input: DeleteVpnSubscriptionInput): Promise<void>;
}
