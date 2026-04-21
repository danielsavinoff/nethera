import { Injectable } from '@nestjs/common';
import { GetSubscriptionResult } from '../../../../application/usecases/GetSubscriptionUseCase.js';
import { GetSubscriptionResponseDto } from '../dtos/GetSubscriptionResponseDto.js';

@Injectable()
export class GetSubscriptionPresenter {
  present(
    result: GetSubscriptionResult,
  ): GetSubscriptionResponseDto {
    return new GetSubscriptionResponseDto({
      id: result.data.subscription.id,
      userId: result.data.subscription.userId,
      planId: result.data.subscription.planId,
      status: result.data.subscription.status,
      startedAt: result.data.subscription.startedAt,
      currentPeriodStartAt:
        result.data.subscription.currentPeriodStartAt,
      currentPeriodEndAt:
        result.data.subscription.currentPeriodEndAt,
      trialStartedAt: result.data.subscription.trialStartedAt,
      trialEndsAt: result.data.subscription.trialEndsAt,
      cancelAtPeriodEnd:
        result.data.subscription.cancelAtPeriodEnd,
      canceledAt: result.data.subscription.canceledAt,
      endedAt: result.data.subscription.endedAt,
      autoRenew: result.data.subscription.autoRenew,
      provider: result.data.subscription.provider,
      providerCustomerId:
        result.data.subscription.providerCustomerId,
      providerSubscriptionId:
        result.data.subscription.providerSubscriptionId,
      createdAt: result.data.subscription.createdAt,
      updatedAt: result.data.subscription.updatedAt,
    });
  }
}
