import { Injectable } from '@nestjs/common';
import { GetPlanResult } from '../../../../application/usecases/GetPlanUseCase.js';
import { GetPlanFeatureResponseDto } from '../dtos/GetPlanFeatureResponseDto.js';
import { GetPlanFeatureTranslationResponseDto } from '../dtos/GetPlanFeatureTranslationResponseDto.js';
import { GetPlanResponseDto } from '../dtos/GetPlanResponseDto.js';
import { GetPlanTranslationResponseDto } from '../dtos/GetPlanTranslationResponseDto.js';

@Injectable()
export class GetPlanPresenter {
  present(result: GetPlanResult): GetPlanResponseDto {
    return new GetPlanResponseDto({
      id: result.data.plan.id,
      code: result.data.plan.code,
      priceAmount: result.data.plan.priceAmount,
      priceCurrency: result.data.plan.priceCurrency,
      billingInterval: result.data.plan.billingInterval,
      billingIntervalCount:
        result.data.plan.billingIntervalCount,
      trialDays: result.data.plan.trialDays,
      active: result.data.plan.active,
      createdAt: result.data.plan.createdAt,
      updatedAt: result.data.plan.updatedAt,
      translations: result.data.plan.getAllTranslations().map(
        (translation) =>
          new GetPlanTranslationResponseDto({
            id: translation.id,
            language: translation.language,
            name: translation.name,
            description: translation.description,
          }),
      ),
      features: result.data.plan.getAllFeatures().map(
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
    });
  }
}
