export interface InvoiceRecord {
  id: string;
  externalId: string;
  provider: string;
  userId: string;
  status: string;
  amountDueMinor: number;
  currency: string;
  externalCheckoutUrl: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
