import type { ExternalPaymentStatus } from '../models/ExternalPayment.js';
import type { SubscriptionCheckoutStatus } from '../../domain/subscription/SubscriptionCheckoutStatus.js';

export interface SubscriptionCheckoutStatusMapper {
  map(
    payment: ExternalPaymentStatus,
  ): SubscriptionCheckoutStatus;
}
