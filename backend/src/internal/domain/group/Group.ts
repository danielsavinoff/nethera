import type { TenantRecord } from '../tenant/TenantRecord.js';
import type { GroupRecord } from './GroupRecord.js';
import { SynchronizableGroupData } from './SynchronizableGroupData.js';

export class Group {
  static hydrate(props: GroupRecord): Group {
    return new Group(props);
  }

  static create(props: {
    id?: GroupRecord['id'];
    name: GroupRecord['name'];
    externalId: GroupRecord['externalId'];
    tenantId: TenantRecord['id'];
    active: GroupRecord['active'];
    isDeleted?: GroupRecord['isDeleted'];
    createdAt?: GroupRecord['createdAt'];
    updatedAt?: GroupRecord['updatedAt'];
  }): Group {
    return new Group({
      id: props.id ?? crypto.randomUUID(),
      name: props.name,
      externalId: props.externalId,
      tenantId: props.tenantId,
      active: props.active,
      isDeleted: props.isDeleted ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  private constructor(private readonly props: GroupRecord) {}

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

  get active(): GroupRecord['active'] {
    return this.props.active;
  }

  get isDeleted(): GroupRecord['isDeleted'] {
    return this.props.isDeleted;
  }

  get createdAt(): GroupRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): GroupRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  syncFromExternal(data: SynchronizableGroupData): Group {
    return new Group({
      ...this.props,
      name: data.name,
      active: data.active,
      isDeleted: false,
      updatedAt: new Date(),
    });
  }

  markDeleted(): Group {
    return new Group({
      ...this.props,
      isDeleted: true,
      updatedAt: new Date(),
    });
  }

  toRecord(): GroupRecord {
    return { ...this.props };
  }
}
