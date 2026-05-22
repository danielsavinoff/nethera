import { Permission } from '../../domain/authorization/Permission.js';
import { Payment } from '../../domain/subscription/Payment.js';
import { PaymentPolicy } from '../../domain/subscription/PaymentPolicy.js';
import { FilterOperator } from '../models/Filter.js';
import type { PaymentRepository } from '../ports/PaymentRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetPaymentsCommand {
  initiatorUserId: string;
}

export interface GetPaymentsResult {
  data: {
    payments: Payment[];
  };
}

export class GetPaymentsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentPolicy: PaymentPolicy,
  ) {}

  async execute(
    command: GetPaymentsCommand,
  ): Promise<GetPaymentsResult> {
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

    this.paymentPolicy.assertCanView(
      {
        userId: initiator.id,
        permissions: initiatorPermissions,
      },
      {
        userId: initiator.id,
      },
    );

    const payments = await this.paymentRepository.loadMany({
      filter: {
        field: 'userId',
        operator: FilterOperator.Equals,
        value: initiator.id,
      },
    });

    return {
      data: {
        payments,
      },
    };
  }
}
