import type { InvoiceRecord } from '../../domain/subscription/InvoiceRecord.js';
import type { ExternalInvoice } from '../models/ExternalInvoice.js';

export interface CreateInvoiceInput {
  invoiceId: InvoiceRecord['id'];
  description: string;
  amount: number;
  currency: InvoiceRecord['currency'];
}

export interface InvoiceProvider {
  create(input: CreateInvoiceInput): Promise<ExternalInvoice>;
}
