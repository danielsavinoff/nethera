export enum Event {
  InvoicePaid = 'invoice.paid',
}

export interface EventPayloadByEvent {
  [Event.InvoicePaid]: {
    invoiceId: string;
  };
}
