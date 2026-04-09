import { User } from '../../domain/user/User.js';
import { DefaultRolesMustExistException } from '../exceptions/DefaultRolesMustExistException.js';
import { NewUserNotFoundInExternalSystemException } from '../exceptions/NewUserNotFoundInExternalSystemException.js';
import { UserProvider } from '../ports/UserProvider.js';
import { UserRepository } from '../ports/UserRepository.js';
import {
  EventHandlerCommand,
  EventHandlerResult,
  EventHandlerUseCase,
} from './HandleIncomingWebhookUseCase.js';
import { Entity } from '../models/Entity.js';
import { UserRole } from '../../domain/authorization/UserRole.js';
import { RoleRepository } from '../ports/RoleRepository.js';

export class ProcessExternalUserAddUseCase
  implements EventHandlerUseCase
{
  constructor(
    private readonly userProvider: UserProvider,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute(
    command: EventHandlerCommand<Entity>,
  ): Promise<EventHandlerResult> {
    const entityId = command.payload.id;

    const externalUser =
      await this.userProvider.fetchByExternalId(
        entityId,
        command.tenant.credentials,
      );

    if (!externalUser) {
      throw new NewUserNotFoundInExternalSystemException();
    }

    const userRole = await this.roleRepository.loadByName(
      UserRole.User,
    );

    if (!userRole) {
      throw new DefaultRolesMustExistException();
    }

    const registeredUser = User.create({
      externalId: externalUser.id,
      tenantId: command.tenant.id,
      active: externalUser.isActive,
      firstName: externalUser.firstName,
      secondName: externalUser.secondName,
      lastName: externalUser.lastName,
    }).withRoles([userRole]);

    await this.userRepository.save(registeredUser);
  }
}
