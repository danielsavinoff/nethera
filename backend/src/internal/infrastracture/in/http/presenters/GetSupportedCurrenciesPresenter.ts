import { Injectable } from '@nestjs/common';
import { GetSupportedCurrenciesResult } from '../../../../application/usecases/GetSupportedCurrenciesUseCase.js';
import { GetSupportedCurrenciesResponseDto } from '../dtos/GetSupportedCurrenciesResponseDto.js';

@Injectable()
export class GetSupportedCurrenciesPresenter {
  present(
    result: GetSupportedCurrenciesResult,
  ): GetSupportedCurrenciesResponseDto {
    return new GetSupportedCurrenciesResponseDto({
      currencies: result.data.currencies,
    });
  }
}
