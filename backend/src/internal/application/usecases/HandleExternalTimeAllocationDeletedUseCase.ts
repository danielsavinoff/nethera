import { ExternalSmartProcessReference } from '../models/ExternalSmartProcessReference.js';
import { SmartProcessRepository } from '../ports/SmartProcessRepository.js';
import { TimeAllocationRepository } from '../ports/TimeAllocationRepository.js';
import {
  EventHandlerCommand,
  EventHandlerResult,
  EventHandlerUseCase,
} from './DispatchIncomingWebhookUseCase.js';

export class HandleExternalTimeAllocationDeletedUseCase
  implements EventHandlerUseCase
{
  constructor(
    private readonly smartProcessRepository: SmartProcessRepository,
    private readonly timeAllocationRepository: TimeAllocationRepository,
  ) {}

  async execute(
    command: EventHandlerCommand<ExternalSmartProcessReference>,
  ): Promise<EventHandlerResult> {
    const configuredSmartProcess =
      await this.smartProcessRepository.loadByTenantId(
        command.tenant.id,
      );

    if (
      !configuredSmartProcess ||
      configuredSmartProcess.externalTypeId !==
        command.payload.externalSmartProcessTypeId
    ) {
      return;
    }

    const timeAllocation =
      await this.timeAllocationRepository.load({
        filters: {
          tenantId: command.tenant.id,
          externalId: command.payload.externalId,
        },
      });

    if (!timeAllocation) {
      return;
    }

    const deletedTimeAllocation = timeAllocation.markDeleted();

    await this.timeAllocationRepository.save(
      deletedTimeAllocation,
    );
  }
}
