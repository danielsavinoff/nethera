export interface TimeAllocationRecord {
  id: string;
  externalId: string;
  tenantId: string;
  groupId?: string;
  taskId: string;
  priority: string;
  hours: number;
  isApproved: boolean;
  weekNumber: number;
  year: number;
  assigneeId: string;
  assignerId: string;
}
