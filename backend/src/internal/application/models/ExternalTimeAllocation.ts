export enum ExternalTimeAllocationCustomFields {
  GroupId = 'groupId',
  TaskId = 'taskId',
  Hours = 'hours',
  IsApproved = 'isApproved',
  WeekNumber = 'weekNumber',
  Year = 'year',
  AssigneeId = 'assigneeId',
  AssignerId = 'assignerId',
}

export interface ExternalTimeAllocation {
  externalId: string;
  externalGroupId: string;
  externalTaskId: string;
  hours: number;
  isApproved: boolean;
  weekNumber: number;
  year: number;
  externalAssigneeId: string;
  externalAssignerId: string;
}
