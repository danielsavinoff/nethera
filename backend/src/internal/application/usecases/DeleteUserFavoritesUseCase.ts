import { UserFavoritePolicy } from '../../domain/user/UserFavoritePolicy.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
import type { UserFavoriteRepository } from '../ports/UserFavoriteRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface DeleteUserFavoritesCommand {
  initiatorUserId: string;
  favoriteId: string;
}

export interface DeleteUserFavoritesResult {
  favoriteId: string;
}

export class DeleteUserFavoritesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userFavoriteRepository: UserFavoriteRepository,
    private readonly userFavoritePolicy: UserFavoritePolicy,
  ) {}

  async execute(
    command: DeleteUserFavoritesCommand,
  ): Promise<DeleteUserFavoritesResult> {
    const initiator =
      await this.userRepository.findByIdWithRoles(
        command.initiatorUserId,
      );

    if (!initiator) {
      throw new UserNotFoundException();
    }

    const favorite =
      await this.userFavoriteRepository.loadByIdOrThrow(
        command.favoriteId,
      );

    this.userFavoritePolicy.assertCanDelete(
      initiator,
      favorite.favoriterUserId,
    );

    await this.userFavoriteRepository.deleteById(favorite.id);

    return {
      favoriteId: favorite.id,
    };
  }
}
