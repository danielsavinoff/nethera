export interface InvoiceLineRecord {
  id: string;
  referenceId: string;
  type: string;
  title?: string;
  amount: number;
  invoiceId: string;
}
