import { Permission } from '../../domain/authorization/Permission.js';
import { SubscriptionPlan } from '../../domain/subscription/SubscriptionPlan.js';
import { SubscriptionPlanPolicy } from '../../domain/subscription/SubscriptionPlanPolicy.js';
import type { SubscriptionPlanRepository } from '../ports/SubscriptionPlanRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetSubscriptionPlansCommand {
  initiatorUserId: string;
}

export interface GetSubscriptionPlansResult {
  data: {
    subscriptionPlans: SubscriptionPlan[];
  };
}

export class GetSubscriptionPlansUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
    private readonly subscriptionPlanPolicy: SubscriptionPlanPolicy,
  ) {}

  async execute(
    command: GetSubscriptionPlansCommand,
  ): Promise<GetSubscriptionPlansResult> {
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

    const subscriptionPlans =
      await this.subscriptionPlanRepository.loadMany({});

    return {
      data: {
        subscriptionPlans,
      },
    };
  }
}
