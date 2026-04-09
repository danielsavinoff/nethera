import { Injectable } from '@nestjs/common';
import { DeleteUserFavoritesResult } from '../../../../application/usecases/DeleteUserFavoritesUseCase.js';
import { DeleteUserFavoritesResponseDto } from '../dtos/DeleteUserFavoritesResponseDto.js';

@Injectable()
export class DeleteUserFavoritesPresenter {
  present(
    result: DeleteUserFavoritesResult,
  ): DeleteUserFavoritesResponseDto {
    return new DeleteUserFavoritesResponseDto({
      favoriteId: result.favoriteId,
    });
  }
}
