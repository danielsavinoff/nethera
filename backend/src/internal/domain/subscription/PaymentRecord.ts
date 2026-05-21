export interface PaymentRecord {
  id: string;
  userId: string;
  status: string;
  amountMinor: number;
  currency: string;
  dueAt?: Date;
  paidAt?: Date;
  failedAt?: Date;
  voidedAt?: Date;
  provider: string;
  externalId: string;
  failureCode?: string;
  failureMessage?: string;
  metadata?: string;
  createdAt: Date;
  updatedAt: Date;
}
