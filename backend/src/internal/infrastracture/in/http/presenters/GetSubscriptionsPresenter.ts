import { Injectable } from '@nestjs/common';
import { GetSubscriptionsResult } from '../../../../application/usecases/GetSubscriptionsUseCase.js';
import { GetSubscriptionResponseDto } from '../dtos/GetSubscriptionResponseDto.js';
import { GetSubscriptionSummaryPlanResponseDto } from '../dtos/GetSubscriptionSummaryPlanResponseDto.js';
import { GetSubscriptionsResponseDto } from '../dtos/GetSubscriptionsResponseDto.js';

@Injectable()
export class GetSubscriptionsPresenter {
  present(
    result: GetSubscriptionsResult,
  ): GetSubscriptionsResponseDto {
    return new GetSubscriptionsResponseDto({
      subscriptions: result.data.subscriptions.map(
        (subscription) => {
          const subscriptionPlan = subscription.getPlan();

          const planTranslation =
            subscriptionPlan?.getAllTranslations()[0];

          return new GetSubscriptionResponseDto({
            id: subscription.id,
            userId: subscription.userId,
            status: subscription.status,
            startedAt: subscription.startedAt,
            trialStartedAt: subscription.trialStartedAt,
            trialEndsAt: subscription.trialEndsAt,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            canceledAt: subscription.canceledAt,
            endedAt: subscription.endedAt,
            autoRenew: subscription.autoRenew,
            subscriptionPlan: subscriptionPlan
              ? new GetSubscriptionSummaryPlanResponseDto({
                  id: subscriptionPlan.id,
                  name: planTranslation?.name,
                })
              : undefined,
            createdAt: subscription.createdAt,
          });
        },
      ),
    });
  }
}
