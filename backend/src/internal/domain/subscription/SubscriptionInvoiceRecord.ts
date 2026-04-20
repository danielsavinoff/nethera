export interface SubscriptionInvoiceRecord {
  id: string;
  subscriptionId: string;
  userId: string;
  status: string;
  amountDue: string;
  amountPaid: string;
  currency: string;
  periodStartAt?: Date;
  periodEndAt?: Date;
  issuedAt: Date;
  dueAt?: Date;
  paidAt?: Date;
  failedAt?: Date;
  voidedAt?: Date;
  provider?: string;
  providerInvoiceId?: string;
  providerPaymentIntentId?: string;
  failureCode?: string;
  failureMessage?: string;
  metadata?: string;
  createdAt: Date;
  updatedAt: Date;
}
