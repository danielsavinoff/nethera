import { SubscriptionCheckout } from '../../domain/subscription/SubscriptionCheckout.js';
import { PaymentProvider } from '../../domain/subscription/PaymentProvider.js';
import type { IdGenerator } from '../ports/IdGenerator.js';
import type { PaymentProviderResolver } from '../ports/PaymentProviderResolver.js';
import type { PlanRepository } from '../ports/PlanRepository.js';
import type { SubscriptionCheckoutStatusMapper } from '../ports/SubscriptionCheckoutStatusMapper.js';
import type { SubscriptionCheckoutRepository } from '../ports/SubscriptionCheckoutRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface CreateSubscriptionCheckoutCommand {
  initiatorUserId: string;
  planId: string;
  provider: PaymentProvider;
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
    private readonly paymentProviderResolver: PaymentProviderResolver,
    private readonly subscriptionCheckoutStatusMapper: SubscriptionCheckoutStatusMapper,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(
    command: CreateSubscriptionCheckoutCommand,
  ): Promise<CreateSubscriptionCheckoutResult> {
    const customer = await this.userRepository.loadOrThrow({
      filters: {
        id: command.initiatorUserId,
      },
    });

    const plan = await this.planRepository.loadOrThrow({
      filters: {
        id: command.planId,
      },
    });

    const paymentProvider = this.paymentProviderResolver.resolve(
      command.provider,
    );

    const subscriptionCheckoutId = this.idGenerator.generate();

    const planTranslation = plan.getTranslation(
      customer.language,
    );

    const planName = planTranslation?.name ?? plan.code;

    const externalPayment = await paymentProvider.create({
      checkoutId: subscriptionCheckoutId,
      description: planName,
      priceAmount: plan.priceAmount,
      priceCurrency: plan.priceCurrency,
    });

    const preparedSubscriptionCheckout =
      SubscriptionCheckout.create({
        id: subscriptionCheckoutId,
        userId: command.initiatorUserId,
        planId: command.planId,
        provider: command.provider,
        status: this.subscriptionCheckoutStatusMapper.map(
          externalPayment.status,
        ),
        providerSessionId: externalPayment.externalId,
        checkoutUrl: externalPayment.checkoutUrl,
      });

    const savedSubscriptionCheckout =
      await this.subscriptionCheckoutRepository.save(
        preparedSubscriptionCheckout,
      );

    return {
      data: {
        subscriptionCheckout: savedSubscriptionCheckout,
      },
    };
  }
}
