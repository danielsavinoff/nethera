import { BillingProvider } from '../../domain/subscription/BillingProvider.js';
import type { InvoiceProvider } from './InvoiceProvider.js';

export interface InvoiceProviderResolver {
  resolve(provider: BillingProvider): InvoiceProvider;
}
