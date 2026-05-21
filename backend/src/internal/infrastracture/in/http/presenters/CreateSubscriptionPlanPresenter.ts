import { Injectable } from '@nestjs/common';
import { CreateSubscriptionPlanResult } from '../../../../application/usecases/CreateSubscriptionPlanUseCase.js';
import { CreateSubscriptionPlanFeatureResponseDto } from '../dtos/CreateSubscriptionPlanFeatureResponseDto.js';
import { CreateSubscriptionPlanFeatureTranslationResponseDto } from '../dtos/CreateSubscriptionPlanFeatureTranslationResponseDto.js';
import { CreateSubscriptionPlanResponseDto } from '../dtos/CreateSubscriptionPlanResponseDto.js';
import { CreateSubscriptionPlanTranslationResponseDto } from '../dtos/CreateSubscriptionPlanTranslationResponseDto.js';
import { GetSubscriptionPriceResponseDto } from '../dtos/GetSubscriptionPriceResponseDto.js';

@Injectable()
export class CreateSubscriptionPlanPresenter {
  present(
    result: CreateSubscriptionPlanResult,
  ): CreateSubscriptionPlanResponseDto {
    return new CreateSubscriptionPlanResponseDto({
      id: result.data.subscriptionPlan.id,
      code: result.data.subscriptionPlan.code,
      billingInterval:
        result.data.subscriptionPlan.billingInterval,
      billingIntervalCount:
        result.data.subscriptionPlan.billingIntervalCount,
      trialDays: result.data.subscriptionPlan.trialDays,
      active: result.data.subscriptionPlan.active,
      translations: result.data.subscriptionPlan
        .getAllTranslations()
        .map(
          (translation) =>
            new CreateSubscriptionPlanTranslationResponseDto({
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
            new CreateSubscriptionPlanFeatureResponseDto({
              id: feature.id,
              code: feature.code,
              value: feature.value,
              sortOrder: feature.sortOrder,
              active: feature.active,
              translations: feature.getAllTranslations().map(
                (translation) =>
                  new CreateSubscriptionPlanFeatureTranslationResponseDto(
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
