import { Module } from '@nestjs/common';
import { UseCaseModule } from '../../bootstrap/UseCaseModule.js';
import { EventEmitterInvoicePaidEventHandler } from './consumers/EventEmitterInvoicePaidEventHandler.js';

@Module({
  imports: [UseCaseModule],
  providers: [EventEmitterInvoicePaidEventHandler],
})
export class MessagingInModule {}
