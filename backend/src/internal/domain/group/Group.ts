import type { TenantRecord } from '../tenant/TenantRecord.js';
import type { GroupRecord } from './GroupRecord.js';

export class Group {
  static hydrate(props: GroupRecord): Group {
    return new Group(props);
  }

  static create(props: {
    id?: GroupRecord['id'];
    name: GroupRecord['name'];
    externalId: GroupRecord['externalId'];
    tenantId: TenantRecord['id'];
  }): Group {
    return new Group({
      id: props.id ?? crypto.randomUUID(),
      name: props.name,
      externalId: props.externalId,
      tenantId: props.tenantId,
    });
  }

  private constructor(
    private readonly props: GroupRecord,
  ) {}

  get id(): GroupRecord['id'] {
    return this.props.id;
  }

  get name(): GroupRecord['name'] {
    return this.props.name;
  }

  get externalId(): GroupRecord['externalId'] {
    return this.props.externalId;
  }

  get tenantId(): GroupRecord['tenantId'] {
    return this.props.tenantId;
  }

  toRecord(): GroupRecord {
    return { ...this.props };
  }
}
