import { SubscriptionPlanTranslationRecord } from './SubscriptionPlanTranslationRecord.js';

export class SubscriptionPlanTranslation {
  static hydrate(
    record: SubscriptionPlanTranslationRecord,
  ): SubscriptionPlanTranslation {
    return new SubscriptionPlanTranslation(record);
  }

  static create(props: {
    id?: SubscriptionPlanTranslationRecord['id'];
    subscriptionPlanId: SubscriptionPlanTranslationRecord['subscriptionPlanId'];
    language: SubscriptionPlanTranslationRecord['language'];
    name: SubscriptionPlanTranslationRecord['name'];
    description?: SubscriptionPlanTranslationRecord['description'];
    createdAt?: SubscriptionPlanTranslationRecord['createdAt'];
    updatedAt?: SubscriptionPlanTranslationRecord['updatedAt'];
  }): SubscriptionPlanTranslation {
    return new SubscriptionPlanTranslation({
      id: props.id ?? crypto.randomUUID(),
      subscriptionPlanId: props.subscriptionPlanId,
      language: props.language,
      name: props.name,
      description: props.description,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  private constructor(
    private readonly props: SubscriptionPlanTranslationRecord,
  ) {}

  get id(): SubscriptionPlanTranslationRecord['id'] {
    return this.props.id;
  }

  get subscriptionPlanId(): SubscriptionPlanTranslationRecord['subscriptionPlanId'] {
    return this.props.subscriptionPlanId;
  }

  get language(): SubscriptionPlanTranslationRecord['language'] {
    return this.props.language;
  }

  get name(): SubscriptionPlanTranslationRecord['name'] {
    return this.props.name;
  }

  get description(): SubscriptionPlanTranslationRecord['description'] {
    return this.props.description;
  }

  get createdAt(): SubscriptionPlanTranslationRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): SubscriptionPlanTranslationRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  toRecord(): SubscriptionPlanTranslationRecord {
    return {
      ...this.props,
    };
  }
}
