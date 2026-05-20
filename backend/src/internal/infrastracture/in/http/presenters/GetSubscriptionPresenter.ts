import { Injectable } from '@nestjs/common';
import { GetSubscriptionResult } from '../../../../application/usecases/GetSubscriptionUseCase.js';
import { GetSubscriptionPlanResponseDto } from '../dtos/GetSubscriptionPlanResponseDto.js';
import { GetSubscriptionResponseDto } from '../dtos/GetSubscriptionResponseDto.js';

@Injectable()
export class GetSubscriptionPresenter {
  present(
    result: GetSubscriptionResult,
  ): GetSubscriptionResponseDto {
    const plan = result.data.subscription.getPlan();
    const planTranslation = plan?.getAllTranslations()[0];

    return new GetSubscriptionResponseDto({
      id: result.data.subscription.id,
      userId: result.data.subscription.userId,
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
      plan: plan
        ? new GetSubscriptionPlanResponseDto({
            id: plan.id,
            name: planTranslation?.name,
          })
        : undefined,
      createdAt: result.data.subscription.createdAt,
      updatedAt: result.data.subscription.updatedAt,
    });
  }
}
