import { Injectable } from '@nestjs/common';
import { GetSubscriptionPlansResult } from '../../../../application/usecases/GetSubscriptionPlansUseCase.js';
import { GetSubscriptionPlanFeatureResponseDto } from '../dtos/GetSubscriptionPlanFeatureResponseDto.js';
import { GetSubscriptionPlanFeatureTranslationResponseDto } from '../dtos/GetSubscriptionPlanFeatureTranslationResponseDto.js';
import { GetSubscriptionPlanResponseDto } from '../dtos/GetSubscriptionPlanResponseDto.js';
import { GetSubscriptionPlansResponseDto } from '../dtos/GetSubscriptionPlansResponseDto.js';
import { GetSubscriptionPlanTranslationResponseDto } from '../dtos/GetSubscriptionPlanTranslationResponseDto.js';
import { GetSubscriptionPriceResponseDto } from '../dtos/GetSubscriptionPriceResponseDto.js';

@Injectable()
export class GetSubscriptionPlansPresenter {
  present(
    result: GetSubscriptionPlansResult,
  ): GetSubscriptionPlansResponseDto {
    return new GetSubscriptionPlansResponseDto({
      subscriptionPlans: result.data.subscriptionPlans.map(
        (subscriptionPlan) =>
          new GetSubscriptionPlanResponseDto({
            id: subscriptionPlan.id,
            code: subscriptionPlan.code,
            billingInterval: subscriptionPlan.billingInterval,
            billingIntervalCount:
              subscriptionPlan.billingIntervalCount,
            trialDays: subscriptionPlan.trialDays,
            active: subscriptionPlan.active,
            createdAt: subscriptionPlan.createdAt,
            updatedAt: subscriptionPlan.updatedAt,
            translations: subscriptionPlan
              .getAllTranslations()
              .map(
                (translation) =>
                  new GetSubscriptionPlanTranslationResponseDto({
                    id: translation.id,
                    language: translation.language,
                    name: translation.name,
                    description: translation.description,
                  }),
              ),
            features: subscriptionPlan.getAllFeatures().map(
              (feature) =>
                new GetSubscriptionPlanFeatureResponseDto({
                  id: feature.id,
                  code: feature.code,
                  value: feature.value,
                  sortOrder: feature.sortOrder,
                  active: feature.active,
                  translations: feature.getAllTranslations().map(
                    (translation) =>
                      new GetSubscriptionPlanFeatureTranslationResponseDto(
                        {
                          id: translation.id,
                          language: translation.language,
                          title: translation.title,
                          description: translation.description,
                        },
                      ),
                  ),
                }),
            ),
            prices: subscriptionPlan.getAllPrices().map(
              (price) =>
                new GetSubscriptionPriceResponseDto({
                  id: price.id,
                  subscriptionPlanId: price.subscriptionPlanId,
                  amountMinor: price.amountMinor,
                  currency: price.currency,
                  countryCode: price.countryCode,
                  active: price.active,
                  createdAt: price.createdAt,
                }),
            ),
          }),
      ),
    });
  }
}
