import type { PlanRecord } from '../../domain/subscription/PlanRecord.js';
import type { SubscriptionInvoiceRecord } from '../../domain/subscription/SubscriptionInvoiceRecord.js';
import { PaymentStatus } from '../../domain/subscription/PaymentStatus.js';
import { PaymentProvider } from '../../domain/subscription/PaymentProvider.js';

export interface ExternalPayment {
  externalId: string;
  description: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  invoiceId: SubscriptionInvoiceRecord['id'];
  priceAmount: PlanRecord['priceAmount'];
  priceCurrency: PlanRecord['priceCurrency'];
  checkoutUrl?: string;
}
