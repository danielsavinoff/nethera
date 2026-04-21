import { Permission } from '../../domain/authorization/Permission.js';
import { Plan } from '../../domain/subscription/Plan.js';
import { PlanPolicy } from '../../domain/subscription/PlanPolicy.js';
import type { PlanRepository } from '../ports/PlanRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetPlansCommand {
  initiatorUserId: string;
}

export interface GetPlansResult {
  data: {
    plans: Plan[];
  };
}

export class GetPlansUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly planRepository: PlanRepository,
    private readonly planPolicy: PlanPolicy,
  ) {}

  async execute(
    command: GetPlansCommand,
  ): Promise<GetPlansResult> {
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

    this.planPolicy.assertCanView(
      {
        permissions: initiatorPermissions,
      },
      undefined,
    );

    const plans = await this.planRepository.loadMany({});

    return {
      data: {
        plans,
      },
    };
  }
}
