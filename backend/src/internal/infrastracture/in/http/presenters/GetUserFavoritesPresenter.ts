import { Injectable } from '@nestjs/common';
import { GetUserFavoritesResult } from '../../../../application/usecases/GetUserFavoritesUseCase.js';
import { GetUserFavoriteResponseDto } from '../dtos/GetUserFavoriteResponseDto.js';
import { GetUserFavoritesResponseDto } from '../dtos/GetUserFavoritesResponseDto.js';

@Injectable()
export class GetUserFavoritesPresenter {
  present(
    result: GetUserFavoritesResult,
  ): GetUserFavoritesResponseDto {
    return new GetUserFavoritesResponseDto({
      favorites: result.favorites.map(
        (favorite) =>
          new GetUserFavoriteResponseDto({
            favoriteId: favorite.favoriteId,
            favoriteUserId: favorite.favoriteUserId,
            favoriteUserDisplayName:
              favorite.favoriteUserDisplayName,
            createdAt: favorite.createdAt,
          }),
      ),
    });
  }
}
