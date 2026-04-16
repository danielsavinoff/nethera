import type { TenantRecord } from '../tenant/TenantRecord.js';
import type { UserRecord } from '../user/UserRecord.js';
import type { TimeAllocationRecord } from './TimeAllocationRecord.js';
import { TimeAllocationPriority } from './TimeAllocationPriority.js';

export class TimeAllocation {
  static hydrate(props: TimeAllocationRecord): TimeAllocation {
    return new TimeAllocation(props);
  }

  static create(props: {
    id?: TimeAllocationRecord['id'];
    externalId: TimeAllocationRecord['externalId'];
    tenantId: TenantRecord['id'];
    groupId?: TimeAllocationRecord['groupId'];
    taskId: TimeAllocationRecord['taskId'];
    priority: TimeAllocationPriority;
    hours: TimeAllocationRecord['hours'];
    isApproved: TimeAllocationRecord['isApproved'];
    weekNumber: TimeAllocationRecord['weekNumber'];
    year: TimeAllocationRecord['year'];
    assigneeId: UserRecord['id'];
    assignerId: UserRecord['id'];
  }): TimeAllocation {
    return new TimeAllocation({
      id: props.id ?? crypto.randomUUID(),
      externalId: props.externalId,
      tenantId: props.tenantId,
      groupId: props.groupId,
      taskId: props.taskId,
      priority: props.priority,
      hours: props.hours,
      isApproved: props.isApproved,
      weekNumber: props.weekNumber,
      year: props.year,
      assigneeId: props.assigneeId,
      assignerId: props.assignerId,
    });
  }

  private constructor(
    private readonly props: TimeAllocationRecord,
  ) {}

  get id(): TimeAllocationRecord['id'] {
    return this.props.id;
  }

  get externalId(): TimeAllocationRecord['externalId'] {
    return this.props.externalId;
  }

  get tenantId(): TimeAllocationRecord['tenantId'] {
    return this.props.tenantId;
  }

  get groupId(): TimeAllocationRecord['groupId'] {
    return this.props.groupId;
  }

  get taskId(): TimeAllocationRecord['taskId'] {
    return this.props.taskId;
  }

  get priority(): TimeAllocationPriority {
    if (
      Object.values(TimeAllocationPriority).includes(
        this.props.priority as any,
      )
    ) {
      return this.props.priority as TimeAllocationPriority;
    }

    return TimeAllocationPriority.Medium;
  }

  get hours(): TimeAllocationRecord['hours'] {
    return this.props.hours;
  }

  get isApproved(): TimeAllocationRecord['isApproved'] {
    return this.props.isApproved;
  }

  get weekNumber(): TimeAllocationRecord['weekNumber'] {
    return this.props.weekNumber;
  }

  get year(): TimeAllocationRecord['year'] {
    return this.props.year;
  }

  get assigneeId(): TimeAllocationRecord['assigneeId'] {
    return this.props.assigneeId;
  }

  get assignerId(): TimeAllocationRecord['assignerId'] {
    return this.props.assignerId;
  }

  toRecord(): TimeAllocationRecord {
    return { ...this.props };
  }
}
