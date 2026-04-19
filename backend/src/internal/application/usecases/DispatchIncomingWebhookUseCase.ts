import { EventProcessorNotFoundException } from '../exceptions/EventProcessorNotFoundException.js';
import { UserProvider } from '../ports/UserProvider.js';
import { IncomingWebhookPayload } from '../models/IncomingWebhookPayload.js';

export interface EventHandlerCommand<
  P extends IncomingWebhookPayload = IncomingWebhookPayload,
> {
  payload: P;
}

export type EventHandlerResult = void;

export interface EventHandlerUseCase {
  execute(
    command: EventHandlerCommand,
  ): Promise<EventHandlerResult>;
}

export interface DispatchIncomingWebhookCommand {
  eventName: string;
  payload: IncomingWebhookPayload;
}

export type DispatchIncomingWebhookResult = void;

export class DispatchIncomingWebhookUseCase {
  constructor(
    private readonly handlers: Record<
      string,
      EventHandlerUseCase
    >,
    private readonly userProvider: UserProvider,
  ) {}

  async execute(
    command: DispatchIncomingWebhookCommand,
  ): Promise<DispatchIncomingWebhookResult> {
    const handler = this.handlers[command.eventName];

    if (!handler) {
      throw new EventProcessorNotFoundException();
    }

    void handler.execute({
      payload: command.payload,
    });
  }
}
