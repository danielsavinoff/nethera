import type { PlanRecord } from '../../domain/subscription/PlanRecord.js';
import type { SubscriptionCheckoutRecord } from '../../domain/subscription/SubscriptionCheckoutRecord.js';
import type { ExternalPayment } from '../models/ExternalPayment.js';

export interface FetchPaymentQuery {
  filters:
    | { externalId: string }
    | { checkoutId: SubscriptionCheckoutRecord['id'] };
}

export interface CreatePaymentInput {
  checkoutId: SubscriptionCheckoutRecord['id'];
  description: string;
  priceAmount: PlanRecord['priceAmount'];
  priceCurrency: PlanRecord['priceCurrency'];
}

export interface PaymentProvider {
  create(input: CreatePaymentInput): Promise<ExternalPayment>;
  fetch(
    query: FetchPaymentQuery,
  ): Promise<ExternalPayment | null>;
}
