import { Injectable } from '@nestjs/common';
import { AddUserFavoritesResult } from '../../../../application/usecases/AddUserFavoritesUseCase.js';
import { AddUserFavoritesResponseDto } from '../dtos/AddUserFavoritesResponseDto.js';

@Injectable()
export class AddUserFavoritesPresenter {
  present(
    result: AddUserFavoritesResult,
  ): AddUserFavoritesResponseDto {
    return new AddUserFavoritesResponseDto({
      favoriteId: result.favorite.id,
      favoriteUserId: result.favorite.favoritedUserId,
    });
  }
}
