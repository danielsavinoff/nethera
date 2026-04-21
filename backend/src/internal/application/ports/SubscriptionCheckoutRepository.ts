import { SubscriptionCheckout } from '../../domain/subscription/SubscriptionCheckout.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface SubscriptionCheckoutRepository {
  save(
    subscriptionCheckout: SubscriptionCheckout,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionCheckout>;
}
