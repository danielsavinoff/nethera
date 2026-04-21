import { PlanTranslationRecord } from './PlanTranslationRecord.js';

export class PlanTranslation {
  static hydrate(
    record: PlanTranslationRecord,
  ): PlanTranslation {
    return new PlanTranslation(record);
  }

  static create(props: {
    id?: PlanTranslationRecord['id'];
    planId: PlanTranslationRecord['planId'];
    language: PlanTranslationRecord['language'];
    name: PlanTranslationRecord['name'];
    description?: PlanTranslationRecord['description'];
    createdAt?: PlanTranslationRecord['createdAt'];
    updatedAt?: PlanTranslationRecord['updatedAt'];
  }): PlanTranslation {
    return new PlanTranslation({
      id: props.id ?? crypto.randomUUID(),
      planId: props.planId,
      language: props.language,
      name: props.name,
      description: props.description,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  private constructor(
    private readonly props: PlanTranslationRecord,
  ) {}

  get id(): PlanTranslationRecord['id'] {
    return this.props.id;
  }

  get planId(): PlanTranslationRecord['planId'] {
    return this.props.planId;
  }

  get language(): PlanTranslationRecord['language'] {
    return this.props.language;
  }

  get name(): PlanTranslationRecord['name'] {
    return this.props.name;
  }

  get description(): PlanTranslationRecord['description'] {
    return this.props.description;
  }

  get createdAt(): PlanTranslationRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): PlanTranslationRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  toRecord(): PlanTranslationRecord {
    return {
      ...this.props,
    };
  }
}
