export enum ExternalTimeAllocationCustomFields {
  GroupId = 'groupId',
  TaskId = 'taskId',
  Hours = 'hours',
  IsApproved = 'isApproved',
  WeekNumber = 'weekNumber',
  Year = 'year',
  Assignee = 'assignee',
  Assigner = 'assigner',
}

export interface ExternalTimeAllocation {
  id: string;
  [ExternalTimeAllocationCustomFields.GroupId]: string;
  [ExternalTimeAllocationCustomFields.TaskId]: string;
  [ExternalTimeAllocationCustomFields.Hours]: number;
  [ExternalTimeAllocationCustomFields.IsApproved]: boolean;
  [ExternalTimeAllocationCustomFields.WeekNumber]: number;
  [ExternalTimeAllocationCustomFields.Year]: number;
  [ExternalTimeAllocationCustomFields.Assignee]: string;
  [ExternalTimeAllocationCustomFields.Assigner]: string;
}
