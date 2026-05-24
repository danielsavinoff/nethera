import { Injectable } from '@nestjs/common';
import { CancelSubscriptionResult } from '../../../../application/usecases/CancelSubscriptionUseCase.js';
import { CancelSubscriptionResponseDto } from '../dtos/CancelSubscriptionResponseDto.js';

@Injectable()
export class CancelSubscriptionPresenter {
  present(
    result: CancelSubscriptionResult,
  ): CancelSubscriptionResponseDto {
    return new CancelSubscriptionResponseDto({
      id: result.data.subscription.id,
      status: result.data.subscription.status,
      canceledAt: result.data.subscription.canceledAt,
      endedAt: result.data.subscription.endedAt,
    });
  }
}
