import { InvalidSubscriptionCheckoutStatusException } from './InvalidSubscriptionCheckoutStatusException.js';
import { SubscriptionCheckoutRecord } from './SubscriptionCheckoutRecord.js';
import { SubscriptionCheckoutStatus } from './SubscriptionCheckoutStatus.js';

export class SubscriptionCheckout {
  static hydrate(
    record: SubscriptionCheckoutRecord,
  ): SubscriptionCheckout {
    return new SubscriptionCheckout(record);
  }

  static create(props: {
    id?: SubscriptionCheckoutRecord['id'];
    userId: SubscriptionCheckoutRecord['userId'];
    planId: SubscriptionCheckoutRecord['planId'];
    status: SubscriptionCheckoutStatus;
    provider: SubscriptionCheckoutRecord['provider'];
    providerSessionId?: SubscriptionCheckoutRecord['providerSessionId'];
    checkoutUrl?: SubscriptionCheckoutRecord['checkoutUrl'];
    expiresAt?: SubscriptionCheckoutRecord['expiresAt'];
    completedAt?: SubscriptionCheckoutRecord['completedAt'];
    failedAt?: SubscriptionCheckoutRecord['failedAt'];
    createdAt?: SubscriptionCheckoutRecord['createdAt'];
    updatedAt?: SubscriptionCheckoutRecord['updatedAt'];
  }): SubscriptionCheckout {
    return new SubscriptionCheckout({
      id: props.id ?? crypto.randomUUID(),
      userId: props.userId,
      planId: props.planId,
      status: props.status,
      provider: props.provider,
      providerSessionId: props.providerSessionId,
      checkoutUrl: props.checkoutUrl,
      expiresAt: props.expiresAt,
      completedAt: props.completedAt,
      failedAt: props.failedAt,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  private constructor(
    private readonly props: SubscriptionCheckoutRecord,
  ) {}

  get id(): SubscriptionCheckoutRecord['id'] {
    return this.props.id;
  }

  get userId(): SubscriptionCheckoutRecord['userId'] {
    return this.props.userId;
  }

  get planId(): SubscriptionCheckoutRecord['planId'] {
    return this.props.planId;
  }

  get status(): SubscriptionCheckoutStatus {
    if (
      !Object.values(SubscriptionCheckoutStatus).includes(
        this.props.status as SubscriptionCheckoutStatus,
      )
    ) {
      throw new InvalidSubscriptionCheckoutStatusException(
        this.props.status,
      );
    }

    return this.props.status as SubscriptionCheckoutStatus;
  }

  get provider(): SubscriptionCheckoutRecord['provider'] {
    return this.props.provider;
  }

  get providerSessionId(): SubscriptionCheckoutRecord['providerSessionId'] {
    return this.props.providerSessionId;
  }

  get checkoutUrl(): SubscriptionCheckoutRecord['checkoutUrl'] {
    return this.props.checkoutUrl;
  }

  get expiresAt(): SubscriptionCheckoutRecord['expiresAt'] {
    return this.props.expiresAt;
  }

  get completedAt(): SubscriptionCheckoutRecord['completedAt'] {
    return this.props.completedAt;
  }

  get failedAt(): SubscriptionCheckoutRecord['failedAt'] {
    return this.props.failedAt;
  }

  get createdAt(): SubscriptionCheckoutRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): SubscriptionCheckoutRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  toRecord(): SubscriptionCheckoutRecord {
    return {
      ...this.props,
    };
  }
}
