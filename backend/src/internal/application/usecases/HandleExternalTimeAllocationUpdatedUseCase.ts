import { UserRole } from '../../domain/authorization/UserRole.js';
import { Group } from '../../domain/group/Group.js';
import { Task } from '../../domain/task/Task.js';
import { TimeAllocation } from '../../domain/time-allocation/TimeAllocation.js';
import { TimeAllocationPriority } from '../../domain/time-allocation/TimeAllocationPriority.js';
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
import { TransactionRunner } from '../ports/TransactionRunner.js';
import { UserProvider } from '../ports/UserProvider.js';
import { UserRepository } from '../ports/UserRepository.js';
import {
  EventHandlerCommand,
  EventHandlerResult,
  EventHandlerUseCase,
} from './DispatchIncomingWebhookUseCase.js';

export class HandleExternalTimeAllocationUpdatedUseCase
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

    if (!configuredSmartProcess) {
      return;
    }

    if (
      configuredSmartProcess.externalTypeId !==
      command.payload.externalSmartProcessTypeId
    ) {
      return;
    }

    const externalTimeAllocation =
      await this.timeAllocationSmartProcessProvider.fetchOrThrow(
        command.tenant.credentials,
        configuredSmartProcess,
        {
          filters: {
            externalId: command.payload.externalId,
          },
        },
      );

    await this.transactionRunner.run(
      async (transactionContext) => {
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

        let task = await this.taskRepository.load(
          {
            filters: {
              tenantId: command.tenant.id,
              externalId: externalTimeAllocation.externalTaskId,
            },
          },
          transactionContext,
        );

        if (!task) {
          const externalTask = await this.taskProvider.fetch(
            command.tenant.credentials,
            {
              filters: {
                externalId:
                  externalTimeAllocation.externalTaskId,
              },
            },
          );

          if (!externalTask) {
            return;
          }

          task = Task.create({
            externalId: externalTask.externalId,
            tenantId: command.tenant.id,
            name: externalTask.title,
            status: externalTask.status,
          });

          await this.taskRepository.save(
            task,
            transactionContext,
          );
        }

        const externalGroupId =
          externalTimeAllocation.externalGroupId;

        let group: Group | undefined;

        if (externalGroupId) {
          const existingGroup = await this.groupRepository.load(
            {
              filters: {
                tenantId: command.tenant.id,
                externalId: externalGroupId,
              },
            },
            transactionContext,
          );

          if (!group) {
            const externalGroup = await this.groupProvider.fetch(
              command.tenant.credentials,
              {
                filters: {
                  externalId: externalGroupId,
                },
              },
            );

            if (externalGroup) {
              const createdGroup = Group.create({
                externalId: externalGroup.externalId,
                tenantId: command.tenant.id,
                name: externalGroup.name,
                active: externalGroup.active,
              });

              group = await this.groupRepository.save(
                createdGroup,
                transactionContext,
              );
            }
          } else {
            group = existingGroup ?? undefined;
          }
        }

        const assigneeExternalId = Number(
          externalTimeAllocation.externalAssigneeId,
        );

        let assignee =
          await this.userRepository.findByTenantAndExternalIdWithRoles(
            command.tenant.id,
            assigneeExternalId,
            transactionContext,
          );

        if (!assignee) {
          const externalAssignee =
            await this.userProvider.fetchOneOrThrow(
              command.tenant.credentials,
              {
                filters: {
                  externalId: assigneeExternalId,
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

          const createdUser = User.create({
            externalId: externalAssignee.externalId,
            tenantId: command.tenant.id,
            active: externalAssignee.isActive,
            firstName: externalAssignee.firstName,
            secondName: externalAssignee.secondName,
            lastName: externalAssignee.lastName,
          }).withRoles([userRole]);

          assignee = await this.userRepository.save(
            createdUser,
            transactionContext,
          );
        }

        const assignerExternalId = Number(
          externalTimeAllocation.externalAssignerId,
        );

        let assigner =
          await this.userRepository.findByTenantAndExternalIdWithRoles(
            command.tenant.id,
            assignerExternalId,
            transactionContext,
          );

        if (!assigner) {
          const externalAssigner =
            await this.userProvider.fetchOneOrThrow(
              command.tenant.credentials,
              {
                filters: {
                  externalId: assignerExternalId,
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

          const createdUser = User.create({
            externalId: externalAssigner.externalId,
            tenantId: command.tenant.id,
            active: externalAssigner.isActive,
            firstName: externalAssigner.firstName,
            secondName: externalAssigner.secondName,
            lastName: externalAssigner.lastName,
          }).withRoles([userRole]);

          assigner = await this.userRepository.save(
            createdUser,
            transactionContext,
          );
        }

        let timeAllocation: TimeAllocation;

        if (!existingTimeAllocation) {
          timeAllocation = TimeAllocation.create({
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
        } else {
          timeAllocation =
            existingTimeAllocation.syncFromExternal({
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
        }

        await this.timeAllocationRepository.save(
          timeAllocation,
          transactionContext,
        );
      },
    );
  }
}
