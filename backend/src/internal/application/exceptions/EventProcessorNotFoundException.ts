export class EventProcessorNotFoundException extends Error {
  constructor(message = 'Event processor not found.') {
    super(message);
    this.name = EventProcessorNotFoundException.name;
  }
}
