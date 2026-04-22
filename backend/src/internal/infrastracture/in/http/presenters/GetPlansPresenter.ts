import { Injectable } from '@nestjs/common';
import { GetPlansResult } from '../../../../application/usecases/GetPlansUseCase.js';
import { GetPlanFeatureResponseDto } from '../dtos/GetPlanFeatureResponseDto.js';
import { GetPlanFeatureTranslationResponseDto } from '../dtos/GetPlanFeatureTranslationResponseDto.js';
import { GetPlanResponseDto } from '../dtos/GetPlanResponseDto.js';
import { GetPlansResponseDto } from '../dtos/GetPlansResponseDto.js';
import { GetPlanTranslationResponseDto } from '../dtos/GetPlanTranslationResponseDto.js';

@Injectable()
export class GetPlansPresenter {
  present(result: GetPlansResult): GetPlansResponseDto {
    return new GetPlansResponseDto({
      plans: result.data.plans.map(
        (plan) =>
          new GetPlanResponseDto({
            id: plan.id,
            code: plan.code,
            priceAmount: plan.priceAmount,
            priceCurrency: plan.priceCurrency,
            billingInterval: plan.billingInterval,
            billingIntervalCount: plan.billingIntervalCount,
            trialDays: plan.trialDays,
            active: plan.active,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt,
            translations: plan.getAllTranslations().map(
              (translation) =>
                new GetPlanTranslationResponseDto({
                  id: translation.id,
                  language: translation.language,
                  name: translation.name,
                  description: translation.description,
                }),
            ),
            features: plan.getAllFeatures().map(
              (feature) =>
                new GetPlanFeatureResponseDto({
                  id: feature.id,
                  code: feature.code,
                  value: feature.value,
                  sortOrder: feature.sortOrder,
                  active: feature.active,
                  translations: feature.getAllTranslations().map(
                    (translation) =>
                      new GetPlanFeatureTranslationResponseDto({
                        id: translation.id,
                        language: translation.language,
                        title: translation.title,
                        description: translation.description,
                      }),
                  ),
                }),
            ),
          }),
      ),
    });
  }
}
