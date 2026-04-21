import type { UserRepository } from '../ports/UserRepository.js';

export interface GetUsersCommand {
  active?: boolean;
  q?: string;
  page?: number;
  limit?: number;
}

export interface GetUsersResultUser {
  id: string;
  displayName: string;
  active: boolean;
}

export interface GetUsersResult {
  total: number;
  page: number;
  limit: number;
  users: GetUsersResultUser[];
}

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    command: GetUsersCommand,
  ): Promise<GetUsersResult> {
    const page = command.page ?? 1;
    const limit = command.limit ?? 100;

    const usersPage = await this.userRepository.loadPage({
      filters: {
        active: command.active,
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
        active: user.active,
      })),
    };
  }
}
