export interface InvoiceRecord {
  id: string;
  externalId: string;
  provider: string;
  billingEmail: string;
  userId: string;
  status: string;
  totalAmountMinor: number;
  amountPaidMinor: number;
  currencyCode: string;
  externalCheckoutUrl: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
