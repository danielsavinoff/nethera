import { TenantTimeAllocationSmartProcessNotFoundException } from '../exceptions/TenantTimeAllocationSmartProcessNotFoundException.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
import type { GroupRepository } from '../ports/GroupRepository.js';
import type { SmartProcessRepository } from '../ports/SmartProcessRepository.js';
import type { TaskRepository } from '../ports/TaskRepository.js';
import type { TenantRepository } from '../ports/TenantRepository.js';
import type { TimeAllocationRepository } from '../ports/TimeAllocationRepository.js';
import type { TimeAllocationSmartProcessProvider } from '../ports/TimeAllocationSmartProcessProvider.js';
import type { TransactionRunner } from '../ports/TransactionRunner.js';
import type { UserRepository } from '../ports/UserRepository.js';
import type { Group } from '../../domain/group/Group.js';
import type { Task } from '../../domain/task/Task.js';
import { TimeAllocation } from '../../domain/time-allocation/TimeAllocation.js';
import { TimeAllocationPolicy } from '../../domain/time-allocation/TimeAllocationPolicy.js';
import { TimeAllocationPriority } from '../../domain/time-allocation/TimeAllocationPriority.js';
import type { User } from '../../domain/user/User.js';

export interface AddTimeAllocationCommand {
  initiatorUserId: string;
  tenantId: string;
  groupId?: string;
  taskId: string;
  hours: number;
  isApproved: boolean;
  weekNumber: number;
  year: number;
  assigneeId: string;
  assignerId: string;
}

export interface AddTimeAllocationResult {
  data: {
    task: Task;
    group?: Group;
    timeAllocation: TimeAllocation;
    assignee: User;
    assigner: User;
  };
}

export class AddTimeAllocationUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly smartProcessRepository: SmartProcessRepository,
    private readonly timeAllocationSmartProcessProvider: TimeAllocationSmartProcessProvider,
    private readonly timeAllocationRepository: TimeAllocationRepository,
    private readonly taskRepository: TaskRepository,
    private readonly groupRepository: GroupRepository,
    private readonly transactionRunner: TransactionRunner,
    private readonly timeAllocationPolicy: TimeAllocationPolicy,
  ) {}

  async execute(
    command: AddTimeAllocationCommand,
  ): Promise<AddTimeAllocationResult> {
    const initiator =
      await this.userRepository.findByIdWithRoles(
        command.initiatorUserId,
      );

    if (!initiator || initiator.tenantId !== command.tenantId) {
      throw new UserNotFoundException();
    }

    this.timeAllocationPolicy.assertCanAdd(initiator);

    const tenant = await this.tenantRepository.loadByIdOrThrow(
      command.tenantId,
    );

    const smartProcess =
      await this.smartProcessRepository.loadByTenantId(
        command.tenantId,
      );

    if (!smartProcess) {
      throw new TenantTimeAllocationSmartProcessNotFoundException();
    }

    const data = await this.transactionRunner.run(
      async (transactionContext) => {
        const task = await this.taskRepository.loadOrThrow(
          {
            filters: {
              id: command.taskId,
            },
          },
          transactionContext,
        );

        const group = command.groupId
          ? await this.groupRepository.loadOrThrow(
              {
                filters: {
                  id: command.groupId,
                },
              },
              transactionContext,
            )
          : undefined;

        const assignee = await this.userRepository.loadOrThrow(
          {
            filters: {
              id: command.assigneeId,
            },
          },
          transactionContext,
        );

        const assigner = await this.userRepository.loadOrThrow(
          {
            filters: {
              id: command.assignerId,
            },
          },
          transactionContext,
        );

        const externalTimeAllocation =
          await this.timeAllocationSmartProcessProvider.create(
            tenant.credentials,
            smartProcess,
            {
              externalGroupId: group?.externalId,
              externalTaskId: task.externalId,
              hours: command.hours,
              isApproved: command.isApproved,
              weekNumber: command.weekNumber,
              year: command.year,
              externalAssigneeId: String(assignee.externalId),
              externalAssignerId: String(assigner.externalId),
            },
          );

        const timeAllocation = TimeAllocation.create({
          externalId: externalTimeAllocation.externalId,
          tenantId: tenant.id,
          groupId: group?.id,
          taskId: task.id,
          priority: TimeAllocationPriority.Medium,
          hours: externalTimeAllocation.hours,
          isApproved: externalTimeAllocation.isApproved,
          weekNumber: externalTimeAllocation.weekNumber,
          year: externalTimeAllocation.year,
          assigneeId: assignee.id,
          assignerId: assigner.id,
        });

        const savedTimeAllocation =
          await this.timeAllocationRepository.save(
            timeAllocation,
            transactionContext,
          );

        return {
          task,
          group,
          timeAllocation: savedTimeAllocation,
          assignee,
          assigner,
        };
      },
    );

    return {
      data: {
        task: data.task,
        group: data.group,
        timeAllocation: data.timeAllocation,
        assignee: data.assignee,
        assigner: data.assigner,
      },
    };
  }
}
