import { ExternalGroupReference } from '../models/ExternalGroupReference.js';
import { GroupRepository } from '../ports/GroupRepository.js';
import {
  EventHandlerCommand,
  EventHandlerResult,
  EventHandlerUseCase,
} from './DispatchIncomingWebhookUseCase.js';

export class HandleExternalGroupDeletedUseCase
  implements EventHandlerUseCase
{
  constructor(
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(
    command: EventHandlerCommand<ExternalGroupReference>,
  ): Promise<EventHandlerResult> {
    const group = await this.groupRepository.load({
      filters: {
        tenantId: command.tenant.id,
        externalId: command.payload.externalId,
      },
    });

    if (!group) {
      return;
    }

    const deletedGroup = group.markDeleted();

    await this.groupRepository.save(deletedGroup);
  }
}
