import { VpnSubscription } from '../../domain/subscription/VpnSubscription.js';
import { SubscriptionPlanNotLoadedException } from '../exceptions/SubscriptionPlanNotLoadedException.js';
import { FilterOperator } from '../models/Filter.js';
import type { IdGenerator } from '../ports/IdGenerator.js';
import type { SubscriptionPlanRepository } from '../ports/SubscriptionPlanRepository.js';
import type { SubscriptionRepository } from '../ports/SubscriptionRepository.js';
import type { TransactionRunner } from '../ports/TransactionRunner.js';
import type { VpnSubscriptionProvider } from '../ports/VpnSubscriptionProvider.js';
import type { VpnSubscriptionRepository } from '../ports/VpnSubscriptionRepository.js';
import { Duration } from '../../domain/time/Duration.js';
import { SubscriptionStatus } from '../../domain/subscription/SubscriptionStatus.js';
import { Subscription } from '../../domain/subscription/Subscription.js';

export interface GrantSubscriptionCommand {
  userId: string;
  subscriptionPlanId: string;
}

export type GrantSubscriptionResult = void;

export class GrantSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
    private readonly vpnSubscriptionProvider: VpnSubscriptionProvider,
    private readonly vpnSubscriptionRepository: VpnSubscriptionRepository,
    private readonly idGenerator: IdGenerator,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(
    command: GrantSubscriptionCommand,
  ): Promise<GrantSubscriptionResult> {
    const subscriptionPlan =
      await this.subscriptionPlanRepository.loadOrThrow({
        filter: {
          field: 'id',
          operator: FilterOperator.Equals,
          value: command.subscriptionPlanId,
        },
      });

    let subscription = await this.subscriptionRepository.load({
      filter: {
        and: [
          {
            field: 'userId',
            operator: FilterOperator.Equals,
            value: command.userId,
          },
          {
            field: 'subscriptionPlanId',
            operator: FilterOperator.Equals,
            value: command.subscriptionPlanId,
          },
          {
            field: 'status',
            operator: FilterOperator.Equals,
            value: SubscriptionStatus.Active,
          },
        ],
      },
      with: {
        subscriptionPlans: true,
      },
    });

    if (!subscription) {
      subscription = Subscription.create({
        userId: command.userId,
        subscriptionPlanId: subscriptionPlan.id,
        status: SubscriptionStatus.Incomplete,
        subscriptionPlan,
      });
    }

    if (!subscription.isPlanLoaded()) {
      throw new SubscriptionPlanNotLoadedException();
    }

    const loadedSubscriptionPlan = subscription.getPlan();

    if (!loadedSubscriptionPlan) {
      throw new SubscriptionPlanNotLoadedException();
    }

    const period = Duration.interval(
      loadedSubscriptionPlan.billingInterval,
      loadedSubscriptionPlan.billingIntervalCount,
    );

    const renewedSubscription = subscription.renew(period);

    let vpnSubscription =
      await this.vpnSubscriptionRepository.load({
        filter: {
          field: 'userId',
          operator: FilterOperator.Equals,
          value: command.userId,
        },
      });

    if (!vpnSubscription) {
      const vpnSubscriptionId = this.idGenerator.generate();

      const externalVpnSubscription =
        await this.vpnSubscriptionProvider.create({
          userName: vpnSubscriptionId,
          expiresAt: renewedSubscription.expiresAt,
        });

      vpnSubscription = VpnSubscription.create({
        id: vpnSubscriptionId,
        userId: subscription.userId,
        externalId: externalVpnSubscription.externalId,
        provider: externalVpnSubscription.provider,
        subscriptionUrl: externalVpnSubscription.subscriptionUrl,
      });
    } else {
      await this.vpnSubscriptionProvider.extendByExternalId(
        vpnSubscription.externalId,
        period,
      );
    }

    await this.transactionRunner.run(
      async (transactionContext) => {
        await this.subscriptionRepository.save(
          renewedSubscription,
          transactionContext,
        );

        await this.vpnSubscriptionRepository.save(
          vpnSubscription,
          transactionContext,
        );
      },
    );
  }
}
