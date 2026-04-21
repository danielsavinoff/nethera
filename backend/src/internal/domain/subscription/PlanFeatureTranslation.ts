import { PlanFeatureTranslationRecord } from './PlanFeatureTranslationRecord.js';

export class PlanFeatureTranslation {
  static hydrate(
    record: PlanFeatureTranslationRecord,
  ): PlanFeatureTranslation {
    return new PlanFeatureTranslation(record);
  }

  static create(props: {
    id?: PlanFeatureTranslationRecord['id'];
    planFeatureId: PlanFeatureTranslationRecord['planFeatureId'];
    language: PlanFeatureTranslationRecord['language'];
    title: PlanFeatureTranslationRecord['title'];
    description?: PlanFeatureTranslationRecord['description'];
    createdAt?: PlanFeatureTranslationRecord['createdAt'];
    updatedAt?: PlanFeatureTranslationRecord['updatedAt'];
  }): PlanFeatureTranslation {
    return new PlanFeatureTranslation({
      id: props.id ?? crypto.randomUUID(),
      planFeatureId: props.planFeatureId,
      language: props.language,
      title: props.title,
      description: props.description,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  private constructor(
    private readonly props: PlanFeatureTranslationRecord,
  ) {}

  get id(): PlanFeatureTranslationRecord['id'] {
    return this.props.id;
  }

  get planFeatureId(): PlanFeatureTranslationRecord['planFeatureId'] {
    return this.props.planFeatureId;
  }

  get language(): PlanFeatureTranslationRecord['language'] {
    return this.props.language;
  }

  get title(): PlanFeatureTranslationRecord['title'] {
    return this.props.title;
  }

  get description(): PlanFeatureTranslationRecord['description'] {
    return this.props.description;
  }

  get createdAt(): PlanFeatureTranslationRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): PlanFeatureTranslationRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  toRecord(): PlanFeatureTranslationRecord {
    return {
      ...this.props,
    };
  }
}
