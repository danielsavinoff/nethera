import { InvalidInvoiceStatusException } from './InvalidInvoiceStatusException.js';
import { InvoiceStatus } from './InvoiceStatus.js';
import { SubscriptionInvoiceRecord } from './SubscriptionInvoiceRecord.js';

export class SubscriptionInvoice {
  static hydrate(
    record: SubscriptionInvoiceRecord,
  ): SubscriptionInvoice {
    return new SubscriptionInvoice(record);
  }

  static create(props: {
    id?: SubscriptionInvoiceRecord['id'];
    subscriptionId: SubscriptionInvoiceRecord['subscriptionId'];
    userId: SubscriptionInvoiceRecord['userId'];
    status: InvoiceStatus;
    amountDue: SubscriptionInvoiceRecord['amountDue'];
    amountPaid?: SubscriptionInvoiceRecord['amountPaid'];
    currency: SubscriptionInvoiceRecord['currency'];
    periodStartAt?: SubscriptionInvoiceRecord['periodStartAt'];
    periodEndAt?: SubscriptionInvoiceRecord['periodEndAt'];
    issuedAt?: SubscriptionInvoiceRecord['issuedAt'];
    dueAt?: SubscriptionInvoiceRecord['dueAt'];
    paidAt?: SubscriptionInvoiceRecord['paidAt'];
    failedAt?: SubscriptionInvoiceRecord['failedAt'];
    voidedAt?: SubscriptionInvoiceRecord['voidedAt'];
    provider?: SubscriptionInvoiceRecord['provider'];
    providerInvoiceId?: SubscriptionInvoiceRecord['providerInvoiceId'];
    providerPaymentIntentId?: SubscriptionInvoiceRecord['providerPaymentIntentId'];
    failureCode?: SubscriptionInvoiceRecord['failureCode'];
    failureMessage?: SubscriptionInvoiceRecord['failureMessage'];
    metadata?: SubscriptionInvoiceRecord['metadata'];
    createdAt?: SubscriptionInvoiceRecord['createdAt'];
    updatedAt?: SubscriptionInvoiceRecord['updatedAt'];
  }): SubscriptionInvoice {
    return new SubscriptionInvoice({
      id: props.id ?? crypto.randomUUID(),
      subscriptionId: props.subscriptionId,
      userId: props.userId,
      status: props.status,
      amountDue: props.amountDue,
      amountPaid: props.amountPaid ?? '0',
      currency: props.currency,
      periodStartAt: props.periodStartAt,
      periodEndAt: props.periodEndAt,
      issuedAt: props.issuedAt ?? new Date(),
      dueAt: props.dueAt,
      paidAt: props.paidAt,
      failedAt: props.failedAt,
      voidedAt: props.voidedAt,
      provider: props.provider,
      providerInvoiceId: props.providerInvoiceId,
      providerPaymentIntentId: props.providerPaymentIntentId,
      failureCode: props.failureCode,
      failureMessage: props.failureMessage,
      metadata: props.metadata,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  private constructor(
    private readonly props: SubscriptionInvoiceRecord,
  ) {}

  get id(): SubscriptionInvoiceRecord['id'] {
    return this.props.id;
  }

  get subscriptionId(): SubscriptionInvoiceRecord['subscriptionId'] {
    return this.props.subscriptionId;
  }

  get userId(): SubscriptionInvoiceRecord['userId'] {
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

  get amountDue(): SubscriptionInvoiceRecord['amountDue'] {
    return this.props.amountDue;
  }

  get amountPaid(): SubscriptionInvoiceRecord['amountPaid'] {
    return this.props.amountPaid;
  }

  get currency(): SubscriptionInvoiceRecord['currency'] {
    return this.props.currency;
  }

  get periodStartAt(): SubscriptionInvoiceRecord['periodStartAt'] {
    return this.props.periodStartAt;
  }

  get periodEndAt(): SubscriptionInvoiceRecord['periodEndAt'] {
    return this.props.periodEndAt;
  }

  get issuedAt(): SubscriptionInvoiceRecord['issuedAt'] {
    return this.props.issuedAt;
  }

  get dueAt(): SubscriptionInvoiceRecord['dueAt'] {
    return this.props.dueAt;
  }

  get paidAt(): SubscriptionInvoiceRecord['paidAt'] {
    return this.props.paidAt;
  }

  get failedAt(): SubscriptionInvoiceRecord['failedAt'] {
    return this.props.failedAt;
  }

  get voidedAt(): SubscriptionInvoiceRecord['voidedAt'] {
    return this.props.voidedAt;
  }

  get provider(): SubscriptionInvoiceRecord['provider'] {
    return this.props.provider;
  }

  get providerInvoiceId(): SubscriptionInvoiceRecord['providerInvoiceId'] {
    return this.props.providerInvoiceId;
  }

  get providerPaymentIntentId(): SubscriptionInvoiceRecord['providerPaymentIntentId'] {
    return this.props.providerPaymentIntentId;
  }

  get failureCode(): SubscriptionInvoiceRecord['failureCode'] {
    return this.props.failureCode;
  }

  get failureMessage(): SubscriptionInvoiceRecord['failureMessage'] {
    return this.props.failureMessage;
  }

  get metadata(): SubscriptionInvoiceRecord['metadata'] {
    return this.props.metadata;
  }

  get createdAt(): SubscriptionInvoiceRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): SubscriptionInvoiceRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  toRecord(): SubscriptionInvoiceRecord {
    return {
      ...this.props,
    };
  }
}
