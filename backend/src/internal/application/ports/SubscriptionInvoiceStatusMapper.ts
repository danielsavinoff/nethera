import type { InvoiceStatus } from '../../domain/subscription/InvoiceStatus.js';
import type { ExternalPaymentStatus } from '../models/ExternalPayment.js';

export interface SubscriptionInvoiceStatusMapper {
  map(payment: ExternalPaymentStatus): InvoiceStatus;
}
