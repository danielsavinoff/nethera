import { UserRole } from '../../domain/authorization/UserRole.js';
import { Group } from '../../domain/group/Group.js';
import { Task } from '../../domain/task/Task.js';
import { TimeAllocationPriority } from '../../domain/time-allocation/TimeAllocationPriority.js';
import { TimeAllocation } from '../../domain/time-allocation/TimeAllocation.js';
import { User } from '../../domain/user/User.js';
import { DefaultRolesMustExistException } from '../exceptions/DefaultRolesMustExistException.js';
import { ExternalSmartProcessReference } from '../models/ExternalSmartProcessReference.js';
import { GroupProvider } from '../ports/GroupProvider.js';
import { GroupRepository } from '../ports/GroupRepository.js';
import { RoleRepository } from '../ports/RoleRepository.js';
import { SmartProcessRepository } from '../ports/SmartProcessRepository.js';
import { TaskProvider } from '../ports/TaskProvider.js';
import { TaskRepository } from '../ports/TaskRepository.js';
import { TimeAllocationRepository } from '../ports/TimeAllocationRepository.js';
import { TimeAllocationSmartProcessProvider } from '../ports/TimeAllocationSmartProcessProvider.js';
import { TransactionContext } from '../models/TransactionContext.js';
import { TransactionRunner } from '../ports/TransactionRunner.js';
import { UserProvider } from '../ports/UserProvider.js';
import { UserRepository } from '../ports/UserRepository.js';
import {
  EventHandlerCommand,
  EventHandlerResult,
  EventHandlerUseCase,
} from './DispatchIncomingWebhookUseCase.js';

export class HandleExternalTimeAllocationUpsertUseCase
  implements EventHandlerUseCase
{
  constructor(
    private readonly smartProcessRepository: SmartProcessRepository,
    private readonly timeAllocationSmartProcessProvider: TimeAllocationSmartProcessProvider,
    private readonly timeAllocationRepository: TimeAllocationRepository,
    private readonly taskRepository: TaskRepository,
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly taskProvider: TaskProvider,
    private readonly groupProvider: GroupProvider,
    private readonly userProvider: UserProvider,
    private readonly roleRepository: RoleRepository,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(
    command: EventHandlerCommand<ExternalSmartProcessReference>,
  ): Promise<EventHandlerResult> {
    const configuredSmartProcess =
      await this.smartProcessRepository.loadByTenantId(
        command.tenant.id,
      );

    if (
      !configuredSmartProcess ||
      configuredSmartProcess.externalId !==
        command.payload.externalSmartProcessId
    ) {
      return;
    }

    const externalTimeAllocation =
      await this.timeAllocationSmartProcessProvider.fetchOrThrow(
        command.tenant.credentials,
        command.payload.externalSmartProcessId,
        {
          filters: {
            externalId: command.payload.externalId,
          },
        },
      );

    await this.transactionRunner.run(
      async (transactionContext) => {
        const task = await this.synchronizeTask(
          command,
          externalTimeAllocation.externalTaskId,
          transactionContext,
        );

        if (!task) {
          return;
        }

        const group = await this.synchronizeGroup(
          command,
          this.normalizeExternalId(
            externalTimeAllocation.externalGroupId,
          ),
          transactionContext,
        );

        const assignee = await this.resolveUser(
          command,
          Number(externalTimeAllocation.externalAssigneeId),
          transactionContext,
        );
        const assigner = await this.resolveUser(
          command,
          Number(externalTimeAllocation.externalAssignerId),
          transactionContext,
        );

        const existingTimeAllocation =
          await this.timeAllocationRepository.load(
            {
              filters: {
                tenantId: command.tenant.id,
                externalId: command.payload.externalId,
              },
            },
            transactionContext,
          );

        const timeAllocation = existingTimeAllocation
          ? existingTimeAllocation.syncFromExternal({
              groupId: group?.id,
              taskId: task.id,
              priority: TimeAllocationPriority.Medium,
              hours: externalTimeAllocation.hours,
              isApproved: externalTimeAllocation.isApproved,
              weekNumber: externalTimeAllocation.weekNumber,
              year: externalTimeAllocation.year,
              assigneeId: assignee.id,
              assignerId: assigner.id,
            })
          : TimeAllocation.create({
              externalId: command.payload.externalId,
              tenantId: command.tenant.id,
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

        await this.timeAllocationRepository.save(
          timeAllocation,
          transactionContext,
        );
      },
    );
  }

  private async synchronizeTask(
    command: EventHandlerCommand<ExternalSmartProcessReference>,
    externalTaskId: string,
    transactionContext: TransactionContext,
  ): Promise<Task | null> {
    const externalTask = await this.taskProvider.fetch(
      command.tenant.credentials,
      {
        filters: {
          externalId: externalTaskId,
        },
      },
    );

    if (!externalTask) {
      return null;
    }

    const existingTask = await this.taskRepository.load(
      {
        filters: {
          tenantId: command.tenant.id,
          externalId: externalTaskId,
        },
      },
      transactionContext,
    );

    const task = existingTask
      ? existingTask.syncFromExternal({
          name: externalTask.title,
          status: externalTask.status,
        })
      : Task.create({
          externalId: externalTask.externalId,
          tenantId: command.tenant.id,
          name: externalTask.title,
          status: externalTask.status,
        });

    return this.taskRepository.save(task, transactionContext);
  }

  private async synchronizeGroup(
    command: EventHandlerCommand<ExternalSmartProcessReference>,
    externalGroupId: string | undefined,
    transactionContext: TransactionContext,
  ): Promise<Group | undefined> {
    if (!externalGroupId) {
      return undefined;
    }

    const externalGroup = await this.groupProvider.fetch(
      command.tenant.credentials,
      {
        filters: {
          externalId: externalGroupId,
        },
      },
    );

    if (!externalGroup) {
      return undefined;
    }

    const existingGroup = await this.groupRepository.load(
      {
        filters: {
          tenantId: command.tenant.id,
          externalId: externalGroupId,
        },
      },
      transactionContext,
    );

    const group = existingGroup
      ? existingGroup.syncFromExternal({
          name: externalGroup.name,
          active: externalGroup.active,
        })
      : Group.create({
          externalId: externalGroup.externalId,
          tenantId: command.tenant.id,
          name: externalGroup.name,
          active: externalGroup.active,
        });

    return this.groupRepository.save(group, transactionContext);
  }

  private async resolveUser(
    command: EventHandlerCommand<ExternalSmartProcessReference>,
    externalUserId: number,
    transactionContext: TransactionContext,
  ): Promise<User> {
    const existingUser =
      await this.userRepository.findByTenantAndExternalIdWithRoles(
        command.tenant.id,
        externalUserId,
        transactionContext,
      );

    if (existingUser) {
      return existingUser;
    }

    const externalUser = await this.userProvider.fetchOneOrThrow(
      command.tenant.credentials,
      {
        filters: {
          externalId: externalUserId,
        },
      },
    );

    const userRole = await this.roleRepository.loadByName(
      UserRole.User,
      transactionContext,
    );

    if (!userRole) {
      throw new DefaultRolesMustExistException();
    }

    const user = User.create({
      externalId: externalUser.externalId,
      tenantId: command.tenant.id,
      active: externalUser.isActive,
      firstName: externalUser.firstName,
      secondName: externalUser.secondName,
      lastName: externalUser.lastName,
    }).withRoles([userRole]);

    return this.userRepository.save(user, transactionContext);
  }

  private normalizeExternalId(
    value: string | undefined,
  ): string | undefined {
    if (
      !value ||
      value === 'undefined' ||
      value === 'null' ||
      value === '0'
    ) {
      return undefined;
    }

    return value;
  }
}
