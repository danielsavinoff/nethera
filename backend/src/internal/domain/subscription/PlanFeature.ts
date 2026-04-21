import { PlanFeatureRecord } from './PlanFeatureRecord.js';
import { PlanFeatureTranslation } from './PlanFeatureTranslation.js';

export class PlanFeature {
  static hydrate(record: PlanFeatureRecord): PlanFeature {
    return new PlanFeature(record);
  }

  static create(props: {
    id?: PlanFeatureRecord['id'];
    planId: PlanFeatureRecord['planId'];
    code: PlanFeatureRecord['code'];
    value?: PlanFeatureRecord['value'];
    sortOrder?: PlanFeatureRecord['sortOrder'];
    active?: PlanFeatureRecord['active'];
    createdAt?: PlanFeatureRecord['createdAt'];
    updatedAt?: PlanFeatureRecord['updatedAt'];
    translations?: PlanFeatureTranslation[];
  }): PlanFeature {
    return new PlanFeature(
      {
        id: props.id ?? crypto.randomUUID(),
        planId: props.planId,
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
    private readonly props: PlanFeatureRecord,
    private readonly translations?: PlanFeatureTranslation[],
  ) {}

  get id(): PlanFeatureRecord['id'] {
    return this.props.id;
  }

  get planId(): PlanFeatureRecord['planId'] {
    return this.props.planId;
  }

  get code(): PlanFeatureRecord['code'] {
    return this.props.code;
  }

  get value(): PlanFeatureRecord['value'] {
    return this.props.value;
  }

  get sortOrder(): PlanFeatureRecord['sortOrder'] {
    return this.props.sortOrder;
  }

  get active(): PlanFeatureRecord['active'] {
    return this.props.active;
  }

  get createdAt(): PlanFeatureRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): PlanFeatureRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  getAllTranslations(): PlanFeatureTranslation[] {
    return this.translations ?? [];
  }

  withTranslations(
    translations: PlanFeatureTranslation[],
  ): PlanFeature {
    return new PlanFeature(this.props, translations);
  }

  toRecord(): PlanFeatureRecord {
    return {
      ...this.props,
    };
  }
}
