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
  [ExternalTimeAllocationCustomFields.Hours]: number;
  [ExternalTimeAllocationCustomFields.IsApproved]: boolean;
  [ExternalTimeAllocationCustomFields.WeekNumber]: number;
  [ExternalTimeAllocationCustomFields.Year]: number;
  externalAssigneeId: string;
  externalAssignerId: string;
}
