import { ExternalTaskReference } from '../models/ExternalTaskReference.js';
import { TaskRepository } from '../ports/TaskRepository.js';
import {
  EventHandlerCommand,
  EventHandlerResult,
  EventHandlerUseCase,
} from './DispatchIncomingWebhookUseCase.js';

export class HandleExternalTaskDeletedUseCase
  implements EventHandlerUseCase
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(
    command: EventHandlerCommand<ExternalTaskReference>,
  ): Promise<EventHandlerResult> {
    const task = await this.taskRepository.load({
      filters: {
        tenantId: command.tenant.id,
        externalId: command.payload.externalId,
      },
    });

    if (!task) {
      return;
    }

    const deletedTask = task.markDeleted();

    await this.taskRepository.save(deletedTask);
  }
}
