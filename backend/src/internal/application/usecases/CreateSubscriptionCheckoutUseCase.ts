import { SubscriptionCheckout } from '../../domain/subscription/SubscriptionCheckout.js';
import { SubscriptionCheckoutStatus } from '../../domain/subscription/SubscriptionCheckoutStatus.js';
import type { PlanRepository } from '../ports/PlanRepository.js';
import type { SubscriptionCheckoutRepository } from '../ports/SubscriptionCheckoutRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface CreateSubscriptionCheckoutCommand {
  initiatorUserId: string;
  planId: string;
  provider: string;
}

export interface CreateSubscriptionCheckoutResult {
  data: {
    subscriptionCheckout: SubscriptionCheckout;
  };
}

export class CreateSubscriptionCheckoutUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly planRepository: PlanRepository,
    private readonly subscriptionCheckoutRepository: SubscriptionCheckoutRepository,
  ) {}

  async execute(
    command: CreateSubscriptionCheckoutCommand,
  ): Promise<CreateSubscriptionCheckoutResult> {
    await this.userRepository.loadOrThrow({
      filters: {
        id: command.initiatorUserId,
      },
    });

    await this.planRepository.loadOrThrow({
      filters: {
        id: command.planId,
      },
    });

    // TODO: Call the payment provider app model here to create
    // an external checkout/payment session.
    const subscriptionCheckout = SubscriptionCheckout.create({
      userId: command.initiatorUserId,
      planId: command.planId,
      provider: command.provider,
      status: SubscriptionCheckoutStatus.Pending,
    });

    const savedSubscriptionCheckout =
      await this.subscriptionCheckoutRepository.save(
        subscriptionCheckout,
      );

    return {
      data: {
        subscriptionCheckout: savedSubscriptionCheckout,
      },
    };
  }
}
