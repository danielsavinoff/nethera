import { Permission } from '../../domain/authorization/Permission.js';
import { UserPolicy } from '../../domain/user/UserPolicy.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetUsersCommand {
  initiatorUserId: string;
  isDeleted?: boolean;
  q?: string;
  page?: number;
  limit?: number;
}

export interface GetUsersResultUser {
  id: string;
  displayName: string;
  isDeleted: boolean;
}

export interface GetUsersResult {
  total: number;
  page: number;
  limit: number;
  users: GetUsersResultUser[];
}

export class GetUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userPolicy: UserPolicy,
  ) {}

  async execute(
    command: GetUsersCommand,
  ): Promise<GetUsersResult> {
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

    this.userPolicy.assertCanView(
      {
        userId: initiator.id,
        permissions: initiatorPermissions,
      },
      {
        all: true,
      },
    );

    const page = command.page ?? 1;

    const limit = command.limit ?? 100;

    const usersPage = await this.userRepository.loadPage({
      filters: {
        isDeleted: command.isDeleted,
        q: command.q,
      },
      page: {
        number: page,
        limit,
      },
    });

    return {
      total: usersPage.total,
      page,
      limit,
      users: usersPage.items.map((user) => ({
        id: user.id,
        displayName: user.displayName,
        isDeleted: user.isDeleted,
      })),
    };
  }
}
