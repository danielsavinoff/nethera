import { UserFavoritePolicy } from '../../domain/user/UserFavoritePolicy.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
import type { UserFavoriteRepository } from '../ports/UserFavoriteRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetUserFavoritesCommand {
  initiatorUserId: string;
  userId: string;
}

export interface GetUserFavoriteResult {
  favoriteId: string;
  favoriteUserId: string;
  favoriteUserDisplayName: string;
  createdAt: Date;
}

export interface GetUserFavoritesResult {
  favorites: GetUserFavoriteResult[];
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

    const user = await this.userRepository.findById(
      command.userId,
    );

    if (!user || user.tenantId !== initiator.tenantId) {
      throw new UserNotFoundException();
    }

    this.userFavoritePolicy.assertCanView(initiator, user.id);

    const favorites =
      await this.userFavoriteRepository.loadAllByUserId(user.id);

    const favoriteUsers = await Promise.all(
      favorites.map((favorite) =>
        this.userRepository.findById(favorite.favoritedUserId),
      ),
    );

    return {
      favorites: favorites.map((favorite, index) => ({
        favoriteId: favorite.id,
        favoriteUserId: favorite.favoritedUserId,
        favoriteUserDisplayName:
          favoriteUsers[index]?.displayName ?? 'Unnamed user',
        createdAt: favorite.createdAt,
      })),
    };
  }
}
