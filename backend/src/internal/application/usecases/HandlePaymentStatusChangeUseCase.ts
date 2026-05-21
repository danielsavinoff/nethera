import type { PaymentProvider } from '../../domain/subscription/PaymentProvider.js';
import type { PaymentStatus } from '../../domain/subscription/PaymentStatus.js';

export interface HandlePaymentStatusChangeCommand {
  externalId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
}

export type HandlePaymentStatusChangeResult = void;

export class HandlePaymentStatusChangeUseCase {
  async execute(
    command: HandlePaymentStatusChangeCommand,
  ): Promise<HandlePaymentStatusChangeResult> {}
}
