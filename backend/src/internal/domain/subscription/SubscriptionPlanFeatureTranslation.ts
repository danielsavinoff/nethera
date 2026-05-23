import { SubscriptionPlanFeatureTranslationRecord } from './SubscriptionPlanFeatureTranslationRecord.js';

export class SubscriptionPlanFeatureTranslation {
  static hydrate(
    record: SubscriptionPlanFeatureTranslationRecord,
  ): SubscriptionPlanFeatureTranslation {
    return new SubscriptionPlanFeatureTranslation(record);
  }

  static create(props: {
    id?: SubscriptionPlanFeatureTranslationRecord['id'];
    subscriptionPlanFeatureId: SubscriptionPlanFeatureTranslationRecord['subscriptionPlanFeatureId'];
    locale: SubscriptionPlanFeatureTranslationRecord['locale'];
    title: SubscriptionPlanFeatureTranslationRecord['title'];
    description?: SubscriptionPlanFeatureTranslationRecord['description'];
    createdAt?: SubscriptionPlanFeatureTranslationRecord['createdAt'];
    updatedAt?: SubscriptionPlanFeatureTranslationRecord['updatedAt'];
  }): SubscriptionPlanFeatureTranslation {
    return new SubscriptionPlanFeatureTranslation({
      id: props.id ?? crypto.randomUUID(),
      subscriptionPlanFeatureId: props.subscriptionPlanFeatureId,
      locale: props.locale,
      title: props.title,
      description: props.description,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  private constructor(
    private readonly props: SubscriptionPlanFeatureTranslationRecord,
  ) {}

  get id(): SubscriptionPlanFeatureTranslationRecord['id'] {
    return this.props.id;
  }

  get subscriptionPlanFeatureId(): SubscriptionPlanFeatureTranslationRecord['subscriptionPlanFeatureId'] {
    return this.props.subscriptionPlanFeatureId;
  }

  get locale(): SubscriptionPlanFeatureTranslationRecord['locale'] {
    return this.props.locale;
  }

  get title(): SubscriptionPlanFeatureTranslationRecord['title'] {
    return this.props.title;
  }

  get description(): SubscriptionPlanFeatureTranslationRecord['description'] {
    return this.props.description;
  }

  get createdAt(): SubscriptionPlanFeatureTranslationRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): SubscriptionPlanFeatureTranslationRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  toRecord(): SubscriptionPlanFeatureTranslationRecord {
    return {
      ...this.props,
    };
  }
}
