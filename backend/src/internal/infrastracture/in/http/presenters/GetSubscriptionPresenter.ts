import { Injectable } from '@nestjs/common';
import { GetSubscriptionResult } from '../../../../application/usecases/GetSubscriptionUseCase.js';
import { GetSubscriptionResponseDto } from '../dtos/GetSubscriptionResponseDto.js';
import { GetSubscriptionSummaryPlanResponseDto } from '../dtos/GetSubscriptionSummaryPlanResponseDto.js';

@Injectable()
export class GetSubscriptionPresenter {
  present(
    result: GetSubscriptionResult,
  ): GetSubscriptionResponseDto {
    const subscriptionPlan = result.data.subscription.getPlan();

    const planTranslation =
      subscriptionPlan?.getAllTranslations()[0];

    return new GetSubscriptionResponseDto({
      id: result.data.subscription.id,
      userId: result.data.subscription.userId,
      status: result.data.subscription.status,
      startedAt: result.data.subscription.startedAt,
      expiresAt: result.data.subscription.expiresAt,
      trialStartedAt: result.data.subscription.trialStartedAt,
      trialEndsAt: result.data.subscription.trialEndsAt,
      cancelAtPeriodEnd:
        result.data.subscription.cancelAtPeriodEnd,
      canceledAt: result.data.subscription.canceledAt,
      endedAt: result.data.subscription.endedAt,
      autoRenew: result.data.subscription.autoRenew,
      subscriptionPlan: subscriptionPlan
        ? new GetSubscriptionSummaryPlanResponseDto({
            id: subscriptionPlan.id,
            name: planTranslation?.name,
          })
        : undefined,
      createdAt: result.data.subscription.createdAt,
    });
  }
}
