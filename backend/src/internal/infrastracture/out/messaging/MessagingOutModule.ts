import { Module } from '@nestjs/common';
import { EventEmitterEventPublisher } from './publishers/EventEmitterEventPublisher.js';

@Module({
  providers: [EventEmitterEventPublisher],
  exports: [EventEmitterEventPublisher],
})
export class MessagingOutModule {}
