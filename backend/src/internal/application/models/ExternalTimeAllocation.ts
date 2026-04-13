export enum ExternalTimeAllocationFields {
  Id = 'id',
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
  [ExternalTimeAllocationFields.Id]: string;
  [ExternalTimeAllocationFields.GroupId]: string;
  [ExternalTimeAllocationFields.TaskId]: string;
  [ExternalTimeAllocationFields.Hours]: number;
  [ExternalTimeAllocationFields.IsApproved]: boolean;
  [ExternalTimeAllocationFields.WeekNumber]: number;
  [ExternalTimeAllocationFields.Year]: number;
  [ExternalTimeAllocationFields.AssigneeId]: string;
  [ExternalTimeAllocationFields.AssignerId]: string;
}
