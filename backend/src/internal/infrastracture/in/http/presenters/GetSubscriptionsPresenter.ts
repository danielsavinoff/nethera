import { Injectable } from '@nestjs/common';
import { GetSubscriptionsResult } from '../../../../application/usecases/GetSubscriptionsUseCase.js';
import { GetSubscriptionPlanResponseDto } from '../dtos/GetSubscriptionPlanResponseDto.js';
import { GetSubscriptionResponseDto } from '../dtos/GetSubscriptionResponseDto.js';
import { GetSubscriptionsResponseDto } from '../dtos/GetSubscriptionsResponseDto.js';

@Injectable()
export class GetSubscriptionsPresenter {
  present(
    result: GetSubscriptionsResult,
  ): GetSubscriptionsResponseDto {
    return new GetSubscriptionsResponseDto({
      subscriptions: result.data.subscriptions.map(
        (subscription) => {
          const plan = subscription.getPlan();
          const planTranslation = plan?.getAllTranslations()[0];

          return new GetSubscriptionResponseDto({
            id: subscription.id,
            userId: subscription.userId,
            status: subscription.status,
            startedAt: subscription.startedAt,
            currentPeriodStartAt:
              subscription.currentPeriodStartAt,
            currentPeriodEndAt: subscription.currentPeriodEndAt,
            trialStartedAt: subscription.trialStartedAt,
            trialEndsAt: subscription.trialEndsAt,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            canceledAt: subscription.canceledAt,
            endedAt: subscription.endedAt,
            autoRenew: subscription.autoRenew,
            plan: plan
              ? new GetSubscriptionPlanResponseDto({
                  id: plan.id,
                  name: planTranslation?.name,
                })
              : undefined,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
          });
        },
      ),
    });
  }
}
