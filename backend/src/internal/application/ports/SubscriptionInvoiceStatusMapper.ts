import type { InvoiceStatus } from '../../domain/subscription/InvoiceStatus.js';
import { ExternalPaymentStatus } from '../models/ExternalPaymentState.js';

export interface SubscriptionInvoiceStatusMapper {
  map(payment: ExternalPaymentStatus): InvoiceStatus;
}
