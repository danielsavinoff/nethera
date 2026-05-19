import type { PlanRecord } from '../../domain/subscription/PlanRecord.js';
import type { SubscriptionInvoiceRecord } from '../../domain/subscription/SubscriptionInvoiceRecord.js';

export enum ExternalPaymentStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED',
  Failed = 'FAILED',
}

export interface ExternalPayment {
  externalId: string;
  invoiceId: SubscriptionInvoiceRecord['id'];
  description: string;
  priceAmount: PlanRecord['priceAmount'];
  priceCurrency: PlanRecord['priceCurrency'];
  checkoutUrl?: string;
  status: ExternalPaymentStatus;
}
