import type { PlanRecord } from '../../domain/subscription/PlanRecord.js';
import type { SubscriptionInvoiceRecord } from '../../domain/subscription/SubscriptionInvoiceRecord.js';
import { ExternalPaymentState } from './ExternalPaymentState.js';

export interface ExternalPayment extends ExternalPaymentState {
  invoiceId: SubscriptionInvoiceRecord['id'];
  description: string;
  priceAmount: PlanRecord['priceAmount'];
  priceCurrency: PlanRecord['priceCurrency'];
  checkoutUrl?: string;
}
