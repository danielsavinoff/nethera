import type { PlanRecord } from '../../domain/subscription/PlanRecord.js';
import type { SubscriptionCheckoutRecord } from '../../domain/subscription/SubscriptionCheckoutRecord.js';

export enum ExternalPaymentStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED',
  Failed = 'FAILED',
}

export interface ExternalPayment {
  externalId: string;
  checkoutId: SubscriptionCheckoutRecord['id'];
  description: string;
  priceAmount: PlanRecord['priceAmount'];
  priceCurrency: PlanRecord['priceCurrency'];
  checkoutUrl?: string;
  status: ExternalPaymentStatus;
}
