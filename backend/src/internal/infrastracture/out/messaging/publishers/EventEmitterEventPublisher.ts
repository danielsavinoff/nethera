import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type {
  Event,
  EventPayloadByEvent,
} from '../../../../application/models/Event.js';
import type { EventPublisher } from '../../../../application/ports/EventPublisher.js';

@Injectable()
export class EventEmitterEventPublisher implements EventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish<TEvent extends Event>(
    event: TEvent,
    payload: EventPayloadByEvent[TEvent],
  ): Promise<void> {
    await this.eventEmitter.emitAsync(event, payload);
  }
}
