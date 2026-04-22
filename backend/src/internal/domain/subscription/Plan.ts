import { BillingInterval } from './BillingInterval.js';
import { InvalidPlanBillingIntervalException } from './InvalidPlanBillingIntervalException.js';
import { PlanFeature } from './PlanFeature.js';
import { PlanRecord } from './PlanRecord.js';
import { PlanTranslation } from './PlanTranslation.js';

export class Plan {
  static hydrate(record: PlanRecord): Plan {
    return new Plan(record);
  }

  static create(props: {
    id?: PlanRecord['id'];
    code: PlanRecord['code'];
    priceAmount: PlanRecord['priceAmount'];
    priceCurrency: PlanRecord['priceCurrency'];
    billingInterval: BillingInterval;
    billingIntervalCount?: PlanRecord['billingIntervalCount'];
    trialDays?: PlanRecord['trialDays'];
    active?: PlanRecord['active'];
    createdAt?: PlanRecord['createdAt'];
    updatedAt?: PlanRecord['updatedAt'];
    translations?: PlanTranslation[];
    features?: PlanFeature[];
  }): Plan {
    return new Plan(
      {
        id: props.id ?? crypto.randomUUID(),
        code: props.code,
        priceAmount: props.priceAmount,
        priceCurrency: props.priceCurrency,
        billingInterval: props.billingInterval,
        billingIntervalCount: props.billingIntervalCount ?? 1,
        trialDays: props.trialDays,
        active: props.active ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      props.translations,
      props.features,
    );
  }

  private constructor(
    private readonly props: PlanRecord,
    private readonly translations?: PlanTranslation[],
    private readonly features?: PlanFeature[],
  ) {}

  get id(): PlanRecord['id'] {
    return this.props.id;
  }

  get code(): PlanRecord['code'] {
    return this.props.code;
  }

  get priceAmount(): PlanRecord['priceAmount'] {
    return this.props.priceAmount;
  }

  get priceCurrency(): PlanRecord['priceCurrency'] {
    return this.props.priceCurrency;
  }

  get billingInterval(): BillingInterval {
    if (
      !Object.values(BillingInterval).includes(
        this.props.billingInterval as BillingInterval,
      )
    ) {
      throw new InvalidPlanBillingIntervalException(
        this.props.billingInterval,
      );
    }

    return this.props.billingInterval as BillingInterval;
  }

  get billingIntervalCount(): PlanRecord['billingIntervalCount'] {
    return this.props.billingIntervalCount;
  }

  get trialDays(): PlanRecord['trialDays'] {
    return this.props.trialDays;
  }

  get active(): PlanRecord['active'] {
    return this.props.active;
  }

  get createdAt(): PlanRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): PlanRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  getAllTranslations(): PlanTranslation[] {
    return this.translations ?? [];
  }

  getTranslation(language?: string): PlanTranslation | null {
    if (!language) {
      return null;
    }

    return (
      this.translations?.find(
        (translation) => translation.language === language,
      ) ?? null
    );
  }

  getAllFeatures(): PlanFeature[] {
    return this.features ?? [];
  }

  withTranslations(translations: PlanTranslation[]): Plan {
    return new Plan(this.props, translations, this.features);
  }

  withFeatures(features: PlanFeature[]): Plan {
    return new Plan(this.props, this.translations, features);
  }

  toRecord(): PlanRecord {
    return {
      ...this.props,
    };
  }
}
