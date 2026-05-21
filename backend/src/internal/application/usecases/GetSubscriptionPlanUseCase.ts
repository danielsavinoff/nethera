import { Permission } from '../../domain/authorization/Permission.js';
import { SubscriptionPlan } from '../../domain/subscription/SubscriptionPlan.js';
import { SubscriptionPlanPolicy } from '../../domain/subscription/SubscriptionPlanPolicy.js';
import type { SubscriptionPlanRepository } from '../ports/SubscriptionPlanRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetSubscriptionPlanCommand {
  initiatorUserId: string;
  subscriptionPlanId: string;
}

export interface GetSubscriptionPlanResult {
  data: {
    subscriptionPlan: SubscriptionPlan;
  };
}

export class GetSubscriptionPlanUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
    private readonly subscriptionPlanPolicy: SubscriptionPlanPolicy,
  ) {}

  async execute(
    command: GetSubscriptionPlanCommand,
  ): Promise<GetSubscriptionPlanResult> {
    const initiator = await this.userRepository.loadOrThrow({
      filters: {
        id: command.initiatorUserId,
      },
      with: {
        roles: true,
      },
    });

    const initiatorPermissions = [
      ...new Set(
        (initiator.roles ?? []).flatMap((role) =>
          role
            .getAllPermissions()
            .map((permission) => permission.name),
        ),
      ),
    ] as Permission[];

    this.subscriptionPlanPolicy.assertCanView({
      permissions: initiatorPermissions,
    });

    const subscriptionPlan =
      await this.subscriptionPlanRepository.loadOrThrow({
        filters: {
          id: command.subscriptionPlanId,
        },
      });

    return {
      data: {
        subscriptionPlan,
      },
    };
  }
}
