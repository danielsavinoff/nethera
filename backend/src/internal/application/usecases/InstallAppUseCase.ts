import { ExternalTimeAllocationCustomFields } from '../models/ExternalTimeAllocation.js';
import { ExternalSmartProcessFieldType } from '../models/ExternalSmartProcessField.js';
import { UserNotBitrixAdminException } from '../exceptions/UserNotBitrixAdminException.js';
import { TenantRepository } from '../ports/TenantRepository.js';
import { UserProvider } from '../ports/UserProvider.js';
import { Logger } from '../../domain/logging/Logger.js';
import { EventProvider } from '../ports/EventProvider.js';
import { UserRepository } from '../ports/UserRepository.js';
import { User } from '../../domain/user/User.js';
import { TransactionRunner } from '../ports/TransactionRunner.js';
import { UserRole } from '../../domain/authorization/UserRole.js';
import { RoleRepository } from '../ports/RoleRepository.js';
import { DefaultRolesMustExistException } from '../exceptions/DefaultRolesMustExistException.js';
import { Tenant } from '../../domain/tenant/Tenant.js';
import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import { SmartProcessRepository } from '../ports/SmartProcessRepository.js';
import { SmartProcessProvider } from '../ports/SmartProcessProvider.js';
import { SmartProcessFieldProvider } from '../ports/SmartProcessFieldProvider.js';
import {
  EntityProvider,
  ExternalEntityType,
} from '../ports/EntityProvider.js';
import { SmartProcess } from '../../domain/smart-process/SmartProcess.js';
import { TenantSmartProcessAlreadyExistsException } from '../exceptions/TenantSmartProcessAlreadyExistsException.js';

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
  private readonly logger: Logger;

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly userProvider: UserProvider,
    private readonly eventProvider: EventProvider,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly smartProcessRepository: SmartProcessRepository,
    private readonly smartProcessProvider: SmartProcessProvider,
    private readonly smartProcessFieldProvider: SmartProcessFieldProvider,
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

    const externalUsers = await this.userProvider.fetchAll(
      tenantCredentials,
      {},
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
              persistedTenant.id,
              externalUser.id,
              transactionContext,
            );

          if (!user) {
            const isInitiator = initiator.id === externalUser.id;

            const registeredUser = User.create({
              externalId: externalUser.id,
              tenantId: persistedTenant.id,
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
              entityType: ExternalEntityType.User,
            },
          })
        ).typeId;

        await this.smartProcessFieldProvider.createMany(
          tenant.credentials,
          {
            smartProcessExternalId: externalSmartProcess.id,
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
                linkedId: userEntityId,
              },
              {
                name: ExternalTimeAllocationCustomFields.AssignerId,
                type: ExternalSmartProcessFieldType.Link,
                linkedId: userEntityId,
              },
            ],
          },
        );

        await this.smartProcessRepository.save(
          SmartProcess.create({
            externalId: externalSmartProcess.id,
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
}
