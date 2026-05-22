import { Interval } from '../time/Interval.js';
import { InvalidPlanBillingIntervalException } from './InvalidPlanBillingIntervalException.js';
import { SubscriptionPrice } from './SubscriptionPrice.js';
import { SubscriptionPlanFeature } from './SubscriptionPlanFeature.js';
import { SubscriptionPlanRecord } from './SubscriptionPlanRecord.js';
import { SubscriptionPlanTranslation } from './SubscriptionPlanTranslation.js';

export class SubscriptionPlan {
  static hydrate(
    record: SubscriptionPlanRecord,
  ): SubscriptionPlan {
    return new SubscriptionPlan(record);
  }

  static create(props: {
    id?: SubscriptionPlanRecord['id'];
    code: SubscriptionPlanRecord['code'];
    billingInterval: Interval;
    billingIntervalCount?: SubscriptionPlanRecord['billingIntervalCount'];
    trialDays?: SubscriptionPlanRecord['trialDays'];
    active?: SubscriptionPlanRecord['active'];
    createdAt?: SubscriptionPlanRecord['createdAt'];
    updatedAt?: SubscriptionPlanRecord['updatedAt'];
    translations?: SubscriptionPlanTranslation[];
    features?: SubscriptionPlanFeature[];
    prices?: SubscriptionPrice[];
  }): SubscriptionPlan {
    return new SubscriptionPlan(
      {
        id: props.id ?? crypto.randomUUID(),
        code: props.code,
        billingInterval: props.billingInterval,
        billingIntervalCount: props.billingIntervalCount ?? 1,
        trialDays: props.trialDays,
        active: props.active ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      props.translations,
      props.features,
      props.prices,
    );
  }

  private constructor(
    private readonly props: SubscriptionPlanRecord,
    private readonly translations?: SubscriptionPlanTranslation[],
    private readonly features?: SubscriptionPlanFeature[],
    private readonly prices?: SubscriptionPrice[],
  ) {}

  get id(): SubscriptionPlanRecord['id'] {
    return this.props.id;
  }

  get code(): SubscriptionPlanRecord['code'] {
    return this.props.code;
  }

  get billingInterval(): Interval {
    if (
      !Object.values(Interval).includes(
        this.props.billingInterval as Interval,
      )
    ) {
      throw new InvalidPlanBillingIntervalException(
        this.props.billingInterval,
      );
    }

    return this.props.billingInterval as Interval;
  }

  get billingIntervalCount(): SubscriptionPlanRecord['billingIntervalCount'] {
    return this.props.billingIntervalCount;
  }

  get trialDays(): SubscriptionPlanRecord['trialDays'] {
    return this.props.trialDays;
  }

  get active(): SubscriptionPlanRecord['active'] {
    return this.props.active;
  }

  get createdAt(): SubscriptionPlanRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): SubscriptionPlanRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  getAllTranslations(): SubscriptionPlanTranslation[] {
    return this.translations ?? [];
  }

  getTranslation(
    language?: string,
  ): SubscriptionPlanTranslation | null {
    if (!language) {
      return null;
    }

    return (
      this.translations?.find(
        (translation) => translation.language === language,
      ) ?? null
    );
  }

  getAllFeatures(): SubscriptionPlanFeature[] {
    return this.features ?? [];
  }

  withTranslations(
    translations: SubscriptionPlanTranslation[],
  ): SubscriptionPlan {
    return new SubscriptionPlan(
      this.props,
      translations,
      this.features,
      this.prices,
    );
  }

  withFeatures(
    features: SubscriptionPlanFeature[],
  ): SubscriptionPlan {
    return new SubscriptionPlan(
      this.props,
      this.translations,
      features,
      this.prices,
    );
  }

  getAllPrices(): SubscriptionPrice[] {
    return this.prices ?? [];
  }

  getActivePrice(
    countryCode?: string,
  ): SubscriptionPrice | null {
    return (
      this.prices?.find(
        (price) =>
          price.active &&
          (!countryCode || price.countryCode === countryCode),
      ) ?? null
    );
  }

  withPrices(prices: SubscriptionPrice[]): SubscriptionPlan {
    return new SubscriptionPlan(
      this.props,
      this.translations,
      this.features,
      prices,
    );
  }

  toRecord(): SubscriptionPlanRecord {
    return {
      ...this.props,
    };
  }
}
