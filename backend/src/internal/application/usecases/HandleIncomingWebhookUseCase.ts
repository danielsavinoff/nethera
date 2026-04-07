import { EventProcessorNotFoundException } from '../exceptions/EventProcessorNotFoundException.js';
import { UserNotBitrixAdminException } from '../exceptions/UserNotBitrixAdminException.js';
import { ExternalUserRepository } from '../ports/ExternalUserRepository.js';
import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import { EnsureTenantAuthValidityUseCase } from './EnsureTenantAuthValidityUseCase.js';
import { Tenant } from '../../domain/tenant/Tenant.js';
import { IncomingWebhookPayload } from '../models/IncomingWebhookPayload.js';

export interface EventHandlerCommand<
  P extends IncomingWebhookPayload = IncomingWebhookPayload,
> {
  payload: P;
  tenant: Tenant;
}

export type EventHandlerResult = void;

export interface EventHandlerUseCase {
  execute(
    command: EventHandlerCommand,
  ): Promise<EventHandlerResult>;
}

export interface HandleIncomingWebhookCommand {
  eventName: string;
  payload: IncomingWebhookPayload;
  tenantCredentials: TenantCredentials;
  tenant: Tenant;
}

export type HandleIncomingWebhookResult = void;

export class HandleIncomingWebhookUseCase {
  constructor(
    private readonly handlers: Record<
      string,
      EventHandlerUseCase
    >,
    private readonly externalUserRepository: ExternalUserRepository,
    private readonly ensureTenantAuthValidityUseCase: EnsureTenantAuthValidityUseCase,
  ) {}

  async execute(
    command: HandleIncomingWebhookCommand,
  ): Promise<HandleIncomingWebhookResult> {
    const isAdmin = await this.externalUserRepository.isAdmin(
      command.tenantCredentials,
    );

    if (!isAdmin) {
      throw new UserNotBitrixAdminException();
    }

    const tenantWithValidCredentials =
      await this.ensureTenantAuthValidityUseCase.execute(
        command.tenant,
        command.tenantCredentials,
      );

    const handler = this.handlers[command.eventName];

    if (!handler) {
      throw new EventProcessorNotFoundException();
    }

    void handler.execute({
      payload: command.payload,
      tenant: tenantWithValidCredentials,
    });
  }
}
