import { ExternalTimeAllocationCustomFields } from '../models/ExternalTimeAllocation.js';
import { ExternalSmartProcessFieldType } from '../models/ExternalSmartProcessField.js';
import type { TransactionContext } from '../models/TransactionContext.js';
import { UserNotBitrixAdminException } from '../exceptions/UserNotBitrixAdminException.js';
import { TenantRepository } from '../ports/TenantRepository.js';
import { UserProvider } from '../ports/UserProvider.js';
import { Logger } from '../../domain/logging/Logger.js';
import { EventProvider } from '../ports/EventProvider.js';
import { UserRepository } from '../ports/UserRepository.js';
import { User } from '../../domain/user/User.js';
import { TransactionRunner } from '../ports/TransactionRunner.js';
import type { Role } from '../../domain/authorization/Role.js';
import { UserRole } from '../../domain/authorization/UserRole.js';
import { RoleRepository } from '../ports/RoleRepository.js';
import { DefaultRolesMustExistException } from '../exceptions/DefaultRolesMustExistException.js';
import { Tenant } from '../../domain/tenant/Tenant.js';
import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import { SmartProcessRepository } from '../ports/SmartProcessRepository.js';
import { SmartProcessProvider } from '../ports/SmartProcessProvider.js';
import { SmartProcessFieldProvider } from '../ports/SmartProcessFieldProvider.js';
import { GroupProvider } from '../ports/GroupProvider.js';
import { GroupRepository } from '../ports/GroupRepository.js';
import {
  EntityProvider,
  ExternalEntityKind,
} from '../ports/EntityProvider.js';
import type { ExternalUser } from '../models/ExternalUser.js';
import { SmartProcess } from '../../domain/smart-process/SmartProcess.js';
import { TenantSmartProcessAlreadyExistsException } from '../exceptions/TenantSmartProcessAlreadyExistsException.js';
import { Group } from '../../domain/group/Group.js';

export interface InstallAppCommand {
  accessToken: string;
  refreshToken: string;
  accessTokenTtlSeconds: number;
  domain: string;
  memberId: string;
  clientEndpoint: string;
}

export type InstallAppResult = void;

export class InstallAppUseCase {
  private static readonly FETCH_GROUPS_PER_PAGE_LIMIT = 50;

  private readonly logger: Logger;

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly userProvider: UserProvider,
    private readonly eventProvider: EventProvider,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly groupRepository: GroupRepository,
    private readonly smartProcessRepository: SmartProcessRepository,
    private readonly smartProcessProvider: SmartProcessProvider,
    private readonly smartProcessFieldProvider: SmartProcessFieldProvider,
    private readonly groupProvider: GroupProvider,
    private readonly entityProvider: EntityProvider,
    private readonly transactionRunner: TransactionRunner,
    logger: Logger,
  ) {
    this.logger = logger.withContext(InstallAppUseCase.name);
  }

  async execute(
    command: InstallAppCommand,
  ): Promise<InstallAppResult> {
    const tenantCredentials = TenantCredentials.hydrate({
      accessToken: command.accessToken,
      refreshToken: command.refreshToken,
      domain: command.domain,
      memberId: command.memberId,
      expiresIn: command.accessTokenTtlSeconds,
      clientEndpoint: command.clientEndpoint,
    });

    const initiator = await this.userProvider.fetchMe(
      tenantCredentials,
    );

    if (!initiator.isAdmin) {
      throw new UserNotBitrixAdminException();
    }

    let tenant = await this.tenantRepository.loadByMemberId(
      command.memberId,
    );

    if (!tenant) {
      tenant = Tenant.create({
        domain: command.domain,
        memberId: command.memberId,
        accessToken: command.accessToken,
        refreshToken: command.refreshToken,
        accessTokenTtlSeconds: command.accessTokenTtlSeconds,
        clientEndpoint: command.clientEndpoint,
        isAdmin: initiator.isAdmin,
      });

      this.logger.log(
        `New tenant record for ${command.domain} created`,
      );
    } else {
      tenant = tenant.refreshCredentials(tenantCredentials);

      this.logger.log(
        `Existing tenant record for ${command.domain} refreshed with new credentials`,
      );
    }

    this.logger.log(
      `Installation for ${tenantCredentials.domain} initiated`,
    );

    await this.transactionRunner.run(
      async (transactionContext) => {
        const persistedTenant = await this.tenantRepository.save(
          tenant,
          transactionContext,
        );

        this.logger.log(
          `Tenant record for ${tenantCredentials.domain} saved`,
        );

        await this.synchronizeGroups(
          persistedTenant,
          transactionContext,
        );

        this.logger.log(
          `Tenant groups for ${tenantCredentials.domain} synchronized`,
        );

        await this.synchronizeUsers(
          persistedTenant,
          initiator,
          transactionContext,
        );

        this.logger.log(
          `Tenant users for ${tenantCredentials.domain} synchronized`,
        );
      },
    );

    const existingSmartProcess =
      await this.smartProcessRepository.loadByTenantId(
        tenant.id,
      );

    if (existingSmartProcess) {
      this.logger.log(
        `Tenant ${tenantCredentials.domain} already has a smart process`,
      );
    } else {
      try {
        const externalSmartProcess =
          await this.smartProcessProvider.create(
            tenant.credentials,
          );

        const userEntityId = (
          await this.entityProvider.fetch(tenant.credentials, {
            filters: {
              entityType: ExternalEntityKind.User,
            },
          })
        ).externalId;

        await this.smartProcessFieldProvider.createMany(
          tenant.credentials,
          {
            smartProcessExternalId:
              externalSmartProcess.externalId,
            fields: [
              {
                name: ExternalTimeAllocationCustomFields.GroupId,
                type: ExternalSmartProcessFieldType.Text,
              },
              {
                name: ExternalTimeAllocationCustomFields.TaskId,
                type: ExternalSmartProcessFieldType.Text,
              },
              {
                name: ExternalTimeAllocationCustomFields.Hours,
                type: ExternalSmartProcessFieldType.Number,
              },
              {
                name: ExternalTimeAllocationCustomFields.IsApproved,
                type: ExternalSmartProcessFieldType.Boolean,
              },
              {
                name: ExternalTimeAllocationCustomFields.WeekNumber,
                type: ExternalSmartProcessFieldType.Number,
              },
              {
                name: ExternalTimeAllocationCustomFields.Year,
                type: ExternalSmartProcessFieldType.Number,
              },
              {
                name: ExternalTimeAllocationCustomFields.AssigneeId,
                type: ExternalSmartProcessFieldType.Link,
                externalLinkedId: userEntityId,
              },
              {
                name: ExternalTimeAllocationCustomFields.AssignerId,
                type: ExternalSmartProcessFieldType.Link,
                externalLinkedId: userEntityId,
              },
            ],
          },
        );

        await this.smartProcessRepository.save(
          SmartProcess.create({
            externalId: externalSmartProcess.externalId,
            tenantId: tenant.id,
          }),
        );

        this.logger.log(
          `Smart process ${externalSmartProcess.title} for ${tenantCredentials.domain} saved`,
        );
      } catch (error) {
        if (
          error instanceof
          TenantSmartProcessAlreadyExistsException
        ) {
          this.logger.log(
            `Tenant ${tenantCredentials.domain} already has a smart process`,
          );
        } else {
          throw error;
        }
      }
    }

    await this.eventProvider.subscribe(tenantCredentials);
  }

  private async synchronizeGroups(
    tenant: Tenant,
    transactionContext: TransactionContext,
  ): Promise<void> {
    let skip = 0;

    while (true) {
      const page = await this.groupProvider.fetchMany(
        tenant.credentials,
        {
          filters: {
            active: true,
          },
          page: {
            limit: InstallAppUseCase.FETCH_GROUPS_PER_PAGE_LIMIT,
            skip: skip,
          },
        },
      );

      for (const externalGroup of page) {
        const group = await this.groupRepository.load(
          {
            filters: {
              tenantId: tenant.id,
              externalId: externalGroup.externalId,
            },
          },
          transactionContext,
        );

        if (!group) {
          const newGroup = Group.create({
            externalId: externalGroup.externalId,
            name: externalGroup.name,
            tenantId: tenant.id,
            active: externalGroup.active,
          });

          await this.groupRepository.save(
            newGroup,
            transactionContext,
          );

          continue;
        }

        const synchronizedGroup = group.syncFromExternal({
          name: externalGroup.name,
          active: externalGroup.active,
        });

        await this.groupRepository.save(
          synchronizedGroup,
          transactionContext,
        );
      }

      if (
        page.length <
        InstallAppUseCase.FETCH_GROUPS_PER_PAGE_LIMIT
      ) {
        return;
      }

      skip += InstallAppUseCase.FETCH_GROUPS_PER_PAGE_LIMIT;
    }
  }

  private async synchronizeUsers(
    tenant: Tenant,
    initiator: ExternalUser,
    transactionContext: TransactionContext,
  ): Promise<void> {
    const externalUsers = await this.userProvider.fetchAll(
      tenant.credentials,
      {},
    );

    if (externalUsers.length === 0) {
      return;
    }

    const roles = await this.roleRepository.loadByNames(
      [UserRole.User, UserRole.Admin],
      transactionContext,
    );

    const userRole = roles.find(
      (role) => role.name === UserRole.User,
    );
    const adminRole = roles.find(
      (role) => role.name === UserRole.Admin,
    );

    if (!userRole || !adminRole) {
      throw new DefaultRolesMustExistException();
    }

    for (const externalUser of externalUsers) {
      const user =
        await this.userRepository.findByTenantAndExternalIdWithRoles(
          tenant.id,
          externalUser.externalId,
          transactionContext,
        );

      if (!user) {
        const isInitiator =
          initiator.externalId === externalUser.externalId;

        const registeredUser = User.create({
          externalId: externalUser.externalId,
          tenantId: tenant.id,
          active: externalUser.isActive,
          firstName: externalUser.firstName,
          secondName: externalUser.secondName,
          lastName: externalUser.lastName,
        }).withRoles([
          userRole,
          ...(isInitiator ? [adminRole] : []),
        ]);

        await this.userRepository.save(
          registeredUser,
          transactionContext,
        );

        continue;
      }

      const synchronizedUser = user.syncFromExternal({
        active: externalUser.isActive,
        firstName: externalUser.firstName,
        secondName: externalUser.secondName,
        lastName: externalUser.lastName,
      });

      await this.userRepository.save(
        synchronizedUser,
        transactionContext,
      );
    }
  }
}
