import { ExternalGroupReference } from '../models/ExternalGroupReference.js';
import { GroupProvider } from '../ports/GroupProvider.js';
import { GroupRepository } from '../ports/GroupRepository.js';
import {
  EventHandlerCommand,
  EventHandlerResult,
  EventHandlerUseCase,
} from './DispatchIncomingWebhookUseCase.js';
import { Group } from '../../domain/group/Group.js';

export class HandleExternalGroupUpsertUseCase
  implements EventHandlerUseCase
{
  constructor(
    private readonly groupProvider: GroupProvider,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(
    command: EventHandlerCommand<ExternalGroupReference>,
  ): Promise<EventHandlerResult> {
    const externalGroup = await this.groupProvider.fetch(
      command.tenant.credentials,
      {
        filters: {
          externalId: command.payload.externalId,
        },
      },
    );

    if (!externalGroup) {
      return;
    }

    const existingGroup = await this.groupRepository.load({
      filters: {
        tenantId: command.tenant.id,
        externalId: command.payload.externalId,
      },
    });

    if (!existingGroup) {
      const createdGroup = Group.create({
        externalId: externalGroup.externalId,
        tenantId: command.tenant.id,
        name: externalGroup.name,
        active: externalGroup.active,
      });

      await this.groupRepository.save(createdGroup);

      return;
    }

    const synchronizedGroup = existingGroup.syncFromExternal({
      name: externalGroup.name,
      active: externalGroup.active,
    });

    await this.groupRepository.save(synchronizedGroup);
  }
}
