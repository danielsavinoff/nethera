import { Tenant } from '../../domain/tenant/Tenant.js';
import { Logger } from '../../domain/logging/Logger.js';
import { TenantRepository } from '../ports/TenantRepository.js';
import {
  EventHandlerCommand,
  EventHandlerResult,
  EventHandlerUseCase,
} from './HandleIncomingWebhookUseCase.js';
import { ConnectionInfo } from '../models/ConnectionInfo.js';

export class ProcessAppInstallUseCase
  implements EventHandlerUseCase
{
  private readonly logger: Logger;

  constructor(
    private readonly tenantRepository: TenantRepository,
    logger: Logger,
  ) {
    this.logger = logger.withContext(
      ProcessAppInstallUseCase.name,
    );
  }

  async execute(
    command: EventHandlerCommand<ConnectionInfo>,
  ): Promise<EventHandlerResult> {
    const connectionInfo = command.payload;
    const reconfiguredTenant = command.tenant.reconfigure({
      clientEndpoint: connectionInfo.clientEndpoint,
      serverEndpoint: connectionInfo.serverEndpoint,
      applicationToken: connectionInfo.applicationToken,
      isInstalled: true,
    });

    await this.tenantRepository.save(reconfiguredTenant);

    this.logger.log(
      `Installation for ${command.tenant.domain} completed`,
    );
  }
}
