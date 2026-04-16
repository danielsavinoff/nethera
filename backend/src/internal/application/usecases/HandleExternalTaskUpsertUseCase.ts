import { ExternalTaskReference } from '../models/ExternalTaskReference.js';
import { TaskProvider } from '../ports/TaskProvider.js';
import { TaskRepository } from '../ports/TaskRepository.js';
import {
  EventHandlerCommand,
  EventHandlerResult,
  EventHandlerUseCase,
} from './DispatchIncomingWebhookUseCase.js';
import { Task } from '../../domain/task/Task.js';

export class HandleExternalTaskUpsertUseCase
  implements EventHandlerUseCase
{
  constructor(
    private readonly taskProvider: TaskProvider,
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(
    command: EventHandlerCommand<ExternalTaskReference>,
  ): Promise<EventHandlerResult> {
    const externalTask = await this.taskProvider.fetch(
      command.tenant.credentials,
      {
        filters: {
          externalId: command.payload.externalId,
        },
      },
    );

    if (!externalTask) {
      return;
    }

    const existingTask = await this.taskRepository.load({
      filters: {
        tenantId: command.tenant.id,
        externalId: command.payload.externalId,
      },
    });

    const task = existingTask
      ? existingTask.syncFromExternal({
          name: externalTask.title,
          status: externalTask.status,
        })
      : Task.create({
          externalId: externalTask.externalId,
          tenantId: command.tenant.id,
          name: externalTask.title,
          status: externalTask.status,
        });

    await this.taskRepository.save(task);
  }
}
