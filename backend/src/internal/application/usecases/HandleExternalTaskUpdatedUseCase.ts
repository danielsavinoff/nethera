import { Task } from '../../domain/task/Task.js';
import { ExternalTaskReference } from '../models/ExternalTaskReference.js';
import { TaskProvider } from '../ports/TaskProvider.js';
import { TaskRepository } from '../ports/TaskRepository.js';
import {
  EventHandlerCommand,
  EventHandlerResult,
  EventHandlerUseCase,
} from './DispatchIncomingWebhookUseCase.js';

export class HandleExternalTaskUpdatedUseCase
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

    if (!existingTask) {
      const createdTask = Task.create({
        externalId: externalTask.externalId,
        name: externalTask.title,
        status: externalTask.status,
        tenantId: command.tenant.id,
      });

      await this.taskRepository.save(createdTask);

      return;
    }

    const synchronizedTask = existingTask.syncFromExternal({
      name: externalTask.title,
      status: externalTask.status,
    });

    await this.taskRepository.save(synchronizedTask);
  }
}
