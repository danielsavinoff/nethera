import type {
  Event,
  EventPayloadByEvent,
} from '../models/Event.js';

export interface EventHandler<TEvent extends Event> {
  handle(payload: EventPayloadByEvent[TEvent]): Promise<void>;
}
