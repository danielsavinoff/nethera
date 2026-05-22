import { InvalidInvoiceStatusException } from './InvalidInvoiceStatusException.js';
import { InvoiceRecord } from './InvoiceRecord.js';
import { InvoiceStatus } from './InvoiceStatus.js';
import { Payment } from './Payment.js';

export class Invoice {
  static hydrate(record: InvoiceRecord): Invoice {
    return new Invoice(record);
  }

  static create(props: {
    id?: InvoiceRecord['id'];
    externalId: InvoiceRecord['externalId'];
    provider: InvoiceRecord['provider'];
    userId: InvoiceRecord['userId'];
    status: InvoiceStatus;
    totalAmountMinor: InvoiceRecord['totalAmountMinor'];
    amountPaidMinor: InvoiceRecord['amountPaidMinor'];
    currency: InvoiceRecord['currency'];
    externalCheckoutUrl: InvoiceRecord['externalCheckoutUrl'];
    expiresAt?: InvoiceRecord['expiresAt'];
    createdAt?: InvoiceRecord['createdAt'];
    updatedAt?: InvoiceRecord['updatedAt'];
  }): Invoice {
    return new Invoice({
      id: props.id ?? crypto.randomUUID(),
      externalId: props.externalId,
      provider: props.provider,
      userId: props.userId,
      status: props.status,
      totalAmountMinor: props.totalAmountMinor,
      amountPaidMinor: props.amountPaidMinor,
      currency: props.currency,
      externalCheckoutUrl: props.externalCheckoutUrl,
      expiresAt: props.expiresAt,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  private constructor(private readonly props: InvoiceRecord) {}

  get id(): InvoiceRecord['id'] {
    return this.props.id;
  }

  get externalId(): InvoiceRecord['externalId'] {
    return this.props.externalId;
  }

  get provider(): InvoiceRecord['provider'] {
    return this.props.provider;
  }

  get userId(): InvoiceRecord['userId'] {
    return this.props.userId;
  }

  get status(): InvoiceStatus {
    if (
      !Object.values(InvoiceStatus).includes(
        this.props.status as InvoiceStatus,
      )
    ) {
      throw new InvalidInvoiceStatusException(this.props.status);
    }

    return this.props.status as InvoiceStatus;
  }

  get amountPaidMinor(): InvoiceRecord['amountPaidMinor'] {
    return this.props.amountPaidMinor;
  }

  get currency(): InvoiceRecord['currency'] {
    return this.props.currency;
  }

  get externalCheckoutUrl(): InvoiceRecord['externalCheckoutUrl'] {
    return this.props.externalCheckoutUrl;
  }

  get expiresAt(): InvoiceRecord['expiresAt'] {
    return this.props.expiresAt;
  }

  get createdAt(): InvoiceRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): InvoiceRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  applyPayment(payment: Payment): Invoice {
    const amountPaidMinor =
      this.props.amountPaidMinor + payment.amountMinor;

    const invoice = Invoice.hydrate({
      ...this.props,
      amountPaidMinor: amountPaidMinor,
    });

    if (invoice.isPaid()) {
      return invoice.markAsPaid();
    }

    return invoice;
  }

  isPaid(): boolean {
    return (
      this.props.totalAmountMinor - this.props.amountPaidMinor <=
      0
    );
  }

  markAsPaid(): Invoice {
    return Invoice.hydrate({
      ...this.props,
      status: InvoiceStatus.Paid,
    });
  }

  toRecord(): InvoiceRecord {
    return {
      ...this.props,
    };
  }
}
