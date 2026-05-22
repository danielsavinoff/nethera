import { InvalidPaymentStatusException } from './InvalidPaymentStatusException.js';
import { PaymentStatus } from './PaymentStatus.js';
import { PaymentRecord } from './PaymentRecord.js';

export class Payment {
  private readonly TERMINAL_PAYMENT_STATUSES =
    new Set<PaymentStatus>([
      PaymentStatus.Paid,
      PaymentStatus.Failed,
      PaymentStatus.Void,
      PaymentStatus.Refunded,
    ]);

  static hydrate(record: PaymentRecord): Payment {
    return new Payment(record);
  }

  static create(props: {
    id?: PaymentRecord['id'];
    userId: PaymentRecord['userId'];
    status: PaymentStatus;
    amountMinor: PaymentRecord['amountMinor'];
    currency: PaymentRecord['currency'];
    dueAt?: PaymentRecord['dueAt'];
    paidAt?: PaymentRecord['paidAt'];
    failedAt?: PaymentRecord['failedAt'];
    voidedAt?: PaymentRecord['voidedAt'];
    provider: PaymentRecord['provider'];
    externalId: PaymentRecord['externalId'];
    failureCode?: PaymentRecord['failureCode'];
    failureMessage?: PaymentRecord['failureMessage'];
    metadata?: PaymentRecord['metadata'];
    createdAt?: PaymentRecord['createdAt'];
    updatedAt?: PaymentRecord['updatedAt'];
  }): Payment {
    return new Payment({
      id: props.id ?? crypto.randomUUID(),
      userId: props.userId,
      status: props.status,
      amountMinor: props.amountMinor,
      currency: props.currency,
      dueAt: props.dueAt,
      paidAt: props.paidAt,
      failedAt: props.failedAt,
      voidedAt: props.voidedAt,
      provider: props.provider,
      externalId: props.externalId,
      failureCode: props.failureCode,
      failureMessage: props.failureMessage,
      metadata: props.metadata,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  private constructor(private readonly props: PaymentRecord) {}

  get id(): PaymentRecord['id'] {
    return this.props.id;
  }

  get userId(): PaymentRecord['userId'] {
    return this.props.userId;
  }

  get status(): PaymentStatus {
    if (
      !Object.values(PaymentStatus).includes(
        this.props.status as PaymentStatus,
      )
    ) {
      throw new InvalidPaymentStatusException(this.props.status);
    }

    return this.props.status as PaymentStatus;
  }

  get amountMinor(): PaymentRecord['amountMinor'] {
    return this.props.amountMinor;
  }

  get currency(): PaymentRecord['currency'] {
    return this.props.currency;
  }

  get dueAt(): PaymentRecord['dueAt'] {
    return this.props.dueAt;
  }

  get paidAt(): PaymentRecord['paidAt'] {
    return this.props.paidAt;
  }

  get failedAt(): PaymentRecord['failedAt'] {
    return this.props.failedAt;
  }

  get voidedAt(): PaymentRecord['voidedAt'] {
    return this.props.voidedAt;
  }

  get provider(): PaymentRecord['provider'] {
    return this.props.provider;
  }

  get externalId(): PaymentRecord['externalId'] {
    return this.props.externalId;
  }

  get failureCode(): PaymentRecord['failureCode'] {
    return this.props.failureCode;
  }

  get failureMessage(): PaymentRecord['failureMessage'] {
    return this.props.failureMessage;
  }

  get metadata(): PaymentRecord['metadata'] {
    return this.props.metadata;
  }

  get createdAt(): PaymentRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): PaymentRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  transitionTo(status: PaymentStatus): Payment {
    return Payment.hydrate({ ...this.props, status: status });
  }

  isTerminal() {
    return this.TERMINAL_PAYMENT_STATUSES.has(this.status);
  }

  hasStatus(status: PaymentStatus) {
    return this.status === status;
  }

  toRecord(): PaymentRecord {
    return {
      ...this.props,
    };
  }
}
