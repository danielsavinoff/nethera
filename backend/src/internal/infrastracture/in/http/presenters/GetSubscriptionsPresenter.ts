import { Injectable } from '@nestjs/common';
import { GetSubscriptionsResult } from '../../../../application/usecases/GetSubscriptionsUseCase.js';
import { GetSubscriptionResponseDto } from '../dtos/GetSubscriptionResponseDto.js';
import { GetSubscriptionsResponseDto } from '../dtos/GetSubscriptionsResponseDto.js';

@Injectable()
export class GetSubscriptionsPresenter {
  present(
    result: GetSubscriptionsResult,
  ): GetSubscriptionsResponseDto {
    return new GetSubscriptionsResponseDto({
      subscriptions: result.data.subscriptions.map(
        (subscription) =>
          new GetSubscriptionResponseDto({
            id: subscription.id,
            userId: subscription.userId,
            planId: subscription.planId,
            status: subscription.status,
            startedAt: subscription.startedAt,
            currentPeriodStartAt:
              subscription.currentPeriodStartAt,
            currentPeriodEndAt:
              subscription.currentPeriodEndAt,
            trialStartedAt: subscription.trialStartedAt,
            trialEndsAt: subscription.trialEndsAt,
            cancelAtPeriodEnd:
              subscription.cancelAtPeriodEnd,
            canceledAt: subscription.canceledAt,
            endedAt: subscription.endedAt,
            autoRenew: subscription.autoRenew,
            provider: subscription.provider,
            providerCustomerId:
              subscription.providerCustomerId,
            providerSubscriptionId:
              subscription.providerSubscriptionId,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
          }),
      ),
    });
  }
}
