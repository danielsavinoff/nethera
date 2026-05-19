import type { PlanRecord } from '../../domain/subscription/PlanRecord.js';
import type { SubscriptionInvoiceRecord } from '../../domain/subscription/SubscriptionInvoiceRecord.js';
import type { ExternalPayment } from '../models/ExternalPayment.js';

export interface FetchPaymentQuery {
  filters:
    | { externalId: string }
    | { invoiceId: SubscriptionInvoiceRecord['id'] };
}

export interface CreatePaymentInput {
  invoiceId: SubscriptionInvoiceRecord['id'];
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
