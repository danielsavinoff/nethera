import type { BillingProvider } from '../../domain/subscription/BillingProvider.js';
import { PaymentStatus } from '../../domain/subscription/PaymentStatus.js';
import { PaymentRepository } from '../ports/PaymentRepository.js';
import { VpnSubscriptionProvider } from '../ports/VpnProviderResolver.js';

export interface HandlePaymentStatusChangeCommand {
  externalId: string;
  provider: BillingProvider;
  status: PaymentStatus;
}

export type HandlePaymentStatusChangeResult = void;

export class HandlePaymentStatusChangeUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly vpnSubscriptionProvider: VpnSubscriptionProvider,
  ) {}

  async execute(
    command: HandlePaymentStatusChangeCommand,
  ): Promise<HandlePaymentStatusChangeResult> {
    if (command.status !== PaymentStatus.Paid) {
      return;
    }

    // const payment = this.paymentRepository.
    return;
  }
}
