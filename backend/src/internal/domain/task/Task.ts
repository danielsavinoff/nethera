import type { TenantRecord } from '../tenant/TenantRecord.js';
import type { TaskRecord } from './TaskRecord.js';
import { TaskStatus } from './TaskStatus.js';

export class Task {
  static hydrate(props: TaskRecord): Task {
    return new Task(props);
  }

  static create(props: {
    id?: TaskRecord['id'];
    name: TaskRecord['name'];
    status: TaskStatus;
    externalId: TaskRecord['externalId'];
    tenantId: TenantRecord['id'];
  }): Task {
    return new Task({
      id: props.id ?? crypto.randomUUID(),
      name: props.name,
      status: props.status,
      externalId: props.externalId,
      tenantId: props.tenantId,
    });
  }

  private constructor(
    private readonly props: TaskRecord,
  ) {}

  get id(): TaskRecord['id'] {
    return this.props.id;
  }

  get name(): TaskRecord['name'] {
    return this.props.name;
  }

  get status(): TaskStatus {
    if (
      Object.values(TaskStatus).includes(
        this.props.status as any,
      )
    ) {
      return this.props.status as TaskStatus;
    }

    return TaskStatus.InProgress;
  }

  get externalId(): TaskRecord['externalId'] {
    return this.props.externalId;
  }

  get tenantId(): TaskRecord['tenantId'] {
    return this.props.tenantId;
  }

  toRecord(): TaskRecord {
    return { ...this.props };
  }
}
