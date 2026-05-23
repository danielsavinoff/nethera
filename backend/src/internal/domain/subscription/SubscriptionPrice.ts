import { SubscriptionPriceRecord } from './SubscriptionPriceRecord.js';

export class SubscriptionPrice {
  static hydrate(
    record: SubscriptionPriceRecord,
  ): SubscriptionPrice {
    return new SubscriptionPrice(record);
  }

  static create(props: {
    id?: SubscriptionPriceRecord['id'];
    subscriptionPlanId: SubscriptionPriceRecord['subscriptionPlanId'];
    amountMinor: SubscriptionPriceRecord['amountMinor'];
    currency: SubscriptionPriceRecord['currency'];
    locale: SubscriptionPriceRecord['locale'];
    active?: SubscriptionPriceRecord['active'];
    createdAt?: SubscriptionPriceRecord['createdAt'];
  }): SubscriptionPrice {
    return new SubscriptionPrice({
      id: props.id ?? crypto.randomUUID(),
      subscriptionPlanId: props.subscriptionPlanId,
      amountMinor: props.amountMinor,
      currency: props.currency,
      locale: props.locale,
      active: props.active ?? true,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  private constructor(
    private readonly props: SubscriptionPriceRecord,
  ) {}

  get id(): SubscriptionPriceRecord['id'] {
    return this.props.id;
  }

  get subscriptionPlanId(): SubscriptionPriceRecord['subscriptionPlanId'] {
    return this.props.subscriptionPlanId;
  }

  get amountMinor(): SubscriptionPriceRecord['amountMinor'] {
    return this.props.amountMinor;
  }

  get currency(): SubscriptionPriceRecord['currency'] {
    return this.props.currency;
  }

  get locale(): SubscriptionPriceRecord['locale'] {
    return this.props.locale;
  }

  get active(): SubscriptionPriceRecord['active'] {
    return this.props.active;
  }

  get createdAt(): SubscriptionPriceRecord['createdAt'] {
    return this.props.createdAt;
  }

  toRecord(): SubscriptionPriceRecord {
    return {
      ...this.props,
    };
  }
}
