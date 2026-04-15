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
  id: string;
  [ExternalTimeAllocationCustomFields.GroupId]: string;
  [ExternalTimeAllocationCustomFields.TaskId]: string;
  [ExternalTimeAllocationCustomFields.Hours]: number;
  [ExternalTimeAllocationCustomFields.IsApproved]: boolean;
  [ExternalTimeAllocationCustomFields.WeekNumber]: number;
  [ExternalTimeAllocationCustomFields.Year]: number;
  [ExternalTimeAllocationCustomFields.AssigneeId]: string;
  [ExternalTimeAllocationCustomFields.AssignerId]: string;
}
