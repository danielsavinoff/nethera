import { Injectable } from '@nestjs/common';
import { UpdateCurrentUserLocaleResult } from '../../../../application/usecases/UpdateCurrentUserLocaleUseCase.js';
import { UpdateCurrentUserLocaleResponseDto } from '../dtos/UpdateCurrentUserLocaleResponseDto.js';

@Injectable()
export class UpdateCurrentUserLocalePresenter {
  present(
    result: UpdateCurrentUserLocaleResult,
  ): UpdateCurrentUserLocaleResponseDto {
    return new UpdateCurrentUserLocaleResponseDto({
      locale: result.data.user.locale ?? '',
    });
  }
}
