import { Injectable } from '@nestjs/common';
import { GetBillingProvidersResult } from '../../../../application/usecases/GetBillingProvidersUseCase.js';
import { GetBillingProvidersResponseDto } from '../dtos/GetBillingProvidersResponseDto.js';

@Injectable()
export class GetBillingProvidersPresenter {
  present(
    result: GetBillingProvidersResult,
  ): GetBillingProvidersResponseDto {
    return new GetBillingProvidersResponseDto({
      providers: result.data.providers,
    });
  }
}
