import { VpnSubscription } from '../../domain/subscription/VpnSubscription.js';
import { VpnSubscriptionRecord } from '../../domain/subscription/VpnSubscriptionRecord.js';
import { RepositoryQuery } from '../models/RepositoryQuery.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface VpnSubscriptionRepository {
  load(
    query: RepositoryQuery<VpnSubscriptionRecord>,
    transactionContext?: TransactionContext,
  ): Promise<VpnSubscription | null>;
  loadOrThrow(
    query: RepositoryQuery<VpnSubscriptionRecord>,
    transactionContext?: TransactionContext,
  ): Promise<VpnSubscription>;
  save(
    vpnSubscription: VpnSubscription,
    transactionContext?: TransactionContext,
  ): Promise<VpnSubscription>;
  delete(
    query: RepositoryQuery<VpnSubscriptionRecord>,
    transactionContext?: TransactionContext,
  ): Promise<void>;
}
