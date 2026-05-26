import { Injectable } from '@nestjs/common';
import { UpdateCurrentUserCurrencyResult } from '../../../../application/usecases/UpdateCurrentUserCurrencyUseCase.js';
import { UpdateCurrentUserCurrencyResponseDto } from '../dtos/UpdateCurrentUserCurrencyResponseDto.js';

@Injectable()
export class UpdateCurrentUserCurrencyPresenter {
  present(
    result: UpdateCurrentUserCurrencyResult,
  ): UpdateCurrentUserCurrencyResponseDto {
    return new UpdateCurrentUserCurrencyResponseDto({
      preferredCurrencyCode:
        result.data.user.preferredCurrencyCode ?? '',
    });
  }
}
