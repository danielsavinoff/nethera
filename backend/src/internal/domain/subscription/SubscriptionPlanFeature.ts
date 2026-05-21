import { SubscriptionPlanFeatureRecord } from './SubscriptionPlanFeatureRecord.js';
import { SubscriptionPlanFeatureTranslation } from './SubscriptionPlanFeatureTranslation.js';

export class SubscriptionPlanFeature {
  static hydrate(
    record: SubscriptionPlanFeatureRecord,
  ): SubscriptionPlanFeature {
    return new SubscriptionPlanFeature(record);
  }

  static create(props: {
    id?: SubscriptionPlanFeatureRecord['id'];
    subscriptionPlanId: SubscriptionPlanFeatureRecord['subscriptionPlanId'];
    code: SubscriptionPlanFeatureRecord['code'];
    value?: SubscriptionPlanFeatureRecord['value'];
    sortOrder?: SubscriptionPlanFeatureRecord['sortOrder'];
    active?: SubscriptionPlanFeatureRecord['active'];
    createdAt?: SubscriptionPlanFeatureRecord['createdAt'];
    updatedAt?: SubscriptionPlanFeatureRecord['updatedAt'];
    translations?: SubscriptionPlanFeatureTranslation[];
  }): SubscriptionPlanFeature {
    return new SubscriptionPlanFeature(
      {
        id: props.id ?? crypto.randomUUID(),
        subscriptionPlanId: props.subscriptionPlanId,
        code: props.code,
        value: props.value,
        sortOrder: props.sortOrder ?? 0,
        active: props.active ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      props.translations,
    );
  }

  private constructor(
    private readonly props: SubscriptionPlanFeatureRecord,
    private readonly translations?: SubscriptionPlanFeatureTranslation[],
  ) {}

  get id(): SubscriptionPlanFeatureRecord['id'] {
    return this.props.id;
  }

  get subscriptionPlanId(): SubscriptionPlanFeatureRecord['subscriptionPlanId'] {
    return this.props.subscriptionPlanId;
  }

  get code(): SubscriptionPlanFeatureRecord['code'] {
    return this.props.code;
  }

  get value(): SubscriptionPlanFeatureRecord['value'] {
    return this.props.value;
  }

  get sortOrder(): SubscriptionPlanFeatureRecord['sortOrder'] {
    return this.props.sortOrder;
  }

  get active(): SubscriptionPlanFeatureRecord['active'] {
    return this.props.active;
  }

  get createdAt(): SubscriptionPlanFeatureRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): SubscriptionPlanFeatureRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  getAllTranslations(): SubscriptionPlanFeatureTranslation[] {
    return this.translations ?? [];
  }

  withTranslations(
    translations: SubscriptionPlanFeatureTranslation[],
  ): SubscriptionPlanFeature {
    return new SubscriptionPlanFeature(this.props, translations);
  }

  toRecord(): SubscriptionPlanFeatureRecord {
    return {
      ...this.props,
    };
  }
}
