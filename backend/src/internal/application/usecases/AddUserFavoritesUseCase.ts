import { UserFavoritePolicy } from '../../domain/user/UserFavoritePolicy.js';
import { UserFavorite } from '../../domain/user/UserFavorite.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
import type { UserFavoriteRepository } from '../ports/UserFavoriteRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface AddUserFavoritesCommand {
  initiatorUserId: string;
  userId: string;
  favoriteUserId: string;
}

export interface AddUserFavoritesResult {
  favorite: UserFavorite;
}

export class AddUserFavoritesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userFavoriteRepository: UserFavoriteRepository,
    private readonly userFavoritePolicy: UserFavoritePolicy,
  ) {}

  async execute(
    command: AddUserFavoritesCommand,
  ): Promise<AddUserFavoritesResult> {
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

    const favoriteUser = await this.userRepository.findById(
      command.favoriteUserId,
    );

    if (
      !favoriteUser ||
      favoriteUser.tenantId !== initiator.tenantId
    ) {
      throw new UserNotFoundException();
    }

    this.userFavoritePolicy.assertCanAdd(
      initiator,
      user.id,
    );

    const favorite = await this.userFavoriteRepository.save(
      UserFavorite.create({
        favoriterUserId: user.id,
        favoritedUserId: favoriteUser.id,
      }),
    );

    return {
      favorite,
    };
  }
}
