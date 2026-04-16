import { TaskStatus } from '../../domain/task/TaskStatus.js';

export interface ExternalTask {
  externalId: string;
  title: string;
  externalGroupId?: string;
  status: TaskStatus;
}
