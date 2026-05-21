import type { PaymentStatus } from '../../domain/subscription/PaymentStatus.js';

export interface ExternalPaymentState {
  externalId: string;
  status: PaymentStatus;
}
