import { Injectable } from '@nestjs/common';
import { GetSubscriptionPlanResult } from '../../../../application/usecases/GetSubscriptionPlanUseCase.js';
import { GetSubscriptionPlanFeatureResponseDto } from '../dtos/GetSubscriptionPlanFeatureResponseDto.js';
import { GetSubscriptionPlanFeatureTranslationResponseDto } from '../dtos/GetSubscriptionPlanFeatureTranslationResponseDto.js';
import { GetSubscriptionPlanResponseDto } from '../dtos/GetSubscriptionPlanResponseDto.js';
import { GetSubscriptionPlanTranslationResponseDto } from '../dtos/GetSubscriptionPlanTranslationResponseDto.js';
import { GetSubscriptionPriceResponseDto } from '../dtos/GetSubscriptionPriceResponseDto.js';

@Injectable()
export class GetSubscriptionPlanPresenter {
  present(
    result: GetSubscriptionPlanResult,
  ): GetSubscriptionPlanResponseDto {
    return new GetSubscriptionPlanResponseDto({
      id: result.data.subscriptionPlan.id,
      code: result.data.subscriptionPlan.code,
      billingInterval:
        result.data.subscriptionPlan.billingInterval,
      billingIntervalCount:
        result.data.subscriptionPlan.billingIntervalCount,
      trialDays: result.data.subscriptionPlan.trialDays,
      active: result.data.subscriptionPlan.active,
      createdAt: result.data.subscriptionPlan.createdAt,
      updatedAt: result.data.subscriptionPlan.updatedAt,
      translations: result.data.subscriptionPlan
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
      features: result.data.subscriptionPlan
        .getAllFeatures()
        .map(
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
      prices: result.data.subscriptionPlan.getAllPrices().map(
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
    });
  }
}
