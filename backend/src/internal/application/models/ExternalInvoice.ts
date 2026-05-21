import type { InvoiceRecord } from '../../domain/subscription/InvoiceRecord.js';
import { BillingProvider } from '../../domain/subscription/BillingProvider.js';
import { InvoiceStatus } from '../../domain/subscription/InvoiceStatus.js';

export interface ExternalInvoice {
  externalId: InvoiceRecord['externalId'];
  provider: BillingProvider;
  status: InvoiceStatus;
  invoiceId: InvoiceRecord['id'];
  amount: number;
  currency: InvoiceRecord['currency'];
  externalCheckoutUrl: InvoiceRecord['externalCheckoutUrl'];
  expiresAt?: InvoiceRecord['expiresAt'];
}
