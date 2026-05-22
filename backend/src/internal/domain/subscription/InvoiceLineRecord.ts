export interface InvoiceLineRecord {
  id: string;
  referenceId: string;
  type: string;
  amount: number;
  invoiceId: string;
}
