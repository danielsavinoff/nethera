import { User } from '../../domain/user/User.js';
import { DefaultRolesMustExistException } from '../exceptions/DefaultRolesMustExistException.js';
import { UserProvider } from '../ports/UserProvider.js';
import { UserRepository } from '../ports/UserRepository.js';
import {
  EventHandlerCommand,
  EventHandlerResult,
  EventHandlerUseCase,
} from './DispatchIncomingWebhookUseCase.js';
import type { ExternalEntity } from '../models/ExternalEntity.js';
import { UserRole } from '../../domain/authorization/UserRole.js';
import { RoleRepository } from '../ports/RoleRepository.js';

export class HandleExternalUserAddedUseCase
  implements EventHandlerUseCase
{
  constructor(
    private readonly userProvider: UserProvider,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute(
    command: EventHandlerCommand<ExternalEntity>,
  ): Promise<EventHandlerResult> {
    const externalUser = await this.userProvider.fetchOneOrThrow(
      command.tenant.credentials,
      {
        filters: {
          externalId: command.payload.externalId,
        },
      },
    );

    const userRole = await this.roleRepository.loadByName(
      UserRole.User,
    );

    if (!userRole) {
      throw new DefaultRolesMustExistException();
    }

    const registeredUser = User.create({
      externalId: externalUser.externalId,
      tenantId: command.tenant.id,
      active: externalUser.isActive,
      firstName: externalUser.firstName,
      secondName: externalUser.secondName,
      lastName: externalUser.lastName,
    }).withRoles([userRole]);

    await this.userRepository.save(registeredUser);
  }
}
