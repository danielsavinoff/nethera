import { InvoiceSubscriptionRecord } from './InvoiceSubscriptionRecord.js';

export class InvoiceSubscription {
  static hydrate(
    record: InvoiceSubscriptionRecord,
  ): InvoiceSubscription {
    return new InvoiceSubscription(record);
  }

  static create(props: {
    id: InvoiceSubscriptionRecord['id'];
    invoiceId: InvoiceSubscriptionRecord['invoiceId'];
    subscriptionId: InvoiceSubscriptionRecord['subscriptionId'];
  }): InvoiceSubscription {
    return new InvoiceSubscription({
      id: props.id,
      invoiceId: props.invoiceId,
      subscriptionId: props.subscriptionId,
    });
  }

  private constructor(
    private readonly props: InvoiceSubscriptionRecord,
  ) {}

  get id(): InvoiceSubscriptionRecord['id'] {
    return this.props.id;
  }

  get paymentId(): InvoiceSubscriptionRecord['invoiceId'] {
    return this.props.invoiceId;
  }

  get subscriptionId(): InvoiceSubscriptionRecord['subscriptionId'] {
    return this.props.subscriptionId;
  }

  toRecord(): InvoiceSubscriptionRecord {
    return {
      ...this.props,
    };
  }
}
