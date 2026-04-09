import { UserFavoritePolicy } from '../../domain/user/UserFavoritePolicy.js';
import { UserFavorite } from '../../domain/user/UserFavorite.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
import type { UserFavoriteRepository } from '../ports/UserFavoriteRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetUserFavoritesCommand {
  initiatorUserId: string;
  userId: string;
}

export interface GetUserFavoritesResult {
  favorites: UserFavorite[];
}

export class GetUserFavoritesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userFavoriteRepository: UserFavoriteRepository,
    private readonly userFavoritePolicy: UserFavoritePolicy,
  ) {}

  async execute(
    command: GetUserFavoritesCommand,
  ): Promise<GetUserFavoritesResult> {
    const initiator =
      await this.userRepository.findByIdWithRoles(
      command.initiatorUserId,
    );

    if (!initiator) {
      throw new UserNotFoundException();
    }

    const user = await this.userRepository.findById(command.userId);

    if (!user || user.tenantId !== initiator.tenantId) {
      throw new UserNotFoundException();
    }

    this.userFavoritePolicy.assertCanView(
      initiator,
      user.id,
    );

    return {
      favorites:
        await this.userFavoriteRepository.loadAllByUserId(
          user.id,
        ),
    };
  }
}
