export interface InvoiceRecord {
  id: string;
  externalId: string;
  provider: string;
  userId: string;
  status: string;
  totalAmountMinor: number;
  amountPaidMinor: number;
  currency: string;
  externalCheckoutUrl: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
