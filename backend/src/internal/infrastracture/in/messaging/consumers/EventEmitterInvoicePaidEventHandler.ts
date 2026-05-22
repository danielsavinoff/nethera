import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  Event,
  EventPayloadByEvent,
} from '../../../../application/models/Event.js';
import type { EventHandler } from '../../../../application/ports/EventHandler.js';
import { FulfillInvoiceUseCase } from '../../../../application/usecases/FulfillInvoiceUseCase.js';

@Injectable()
export class EventEmitterInvoicePaidEventHandler implements EventHandler<Event.InvoicePaid> {
  constructor(
    private readonly fulfillInvoiceUseCase: FulfillInvoiceUseCase,
  ) {}

  @OnEvent(Event.InvoicePaid)
  async handle(
    payload: EventPayloadByEvent[Event.InvoicePaid],
  ): Promise<void> {
    await this.fulfillInvoiceUseCase.execute({
      invoiceId: payload.invoiceId,
    });
  }
}
