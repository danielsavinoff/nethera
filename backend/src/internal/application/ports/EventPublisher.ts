import type {
  Event,
  EventPayloadByEvent,
} from '../models/Event.js';

export interface EventPublisher<TEvent extends Event = Event> {
  publish(
    event: TEvent,
    payload: EventPayloadByEvent[TEvent],
  ): Promise<void>;
}
