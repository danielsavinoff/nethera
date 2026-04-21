import { Injectable } from '@nestjs/common';
import { CreatePlanResult } from '../../../../application/usecases/CreatePlanUseCase.js';
import { CreatePlanFeatureResponseDto } from '../dtos/CreatePlanFeatureResponseDto.js';
import { CreatePlanFeatureTranslationResponseDto } from '../dtos/CreatePlanFeatureTranslationResponseDto.js';
import { CreatePlanResponseDto } from '../dtos/CreatePlanResponseDto.js';
import { CreatePlanTranslationResponseDto } from '../dtos/CreatePlanTranslationResponseDto.js';

@Injectable()
export class CreatePlanPresenter {
  present(result: CreatePlanResult): CreatePlanResponseDto {
    return new CreatePlanResponseDto({
      id: result.data.plan.id,
      code: result.data.plan.code,
      priceAmount: result.data.plan.priceAmount,
      priceCurrency: result.data.plan.priceCurrency,
      billingInterval: result.data.plan.billingInterval,
      billingIntervalCount:
        result.data.plan.billingIntervalCount,
      trialDays: result.data.plan.trialDays,
      active: result.data.plan.active,
      translations: result.data.plan.getAllTranslations().map(
        (translation) =>
          new CreatePlanTranslationResponseDto({
            id: translation.id,
            language: translation.language,
            name: translation.name,
            description: translation.description,
          }),
      ),
      features: result.data.plan.getAllFeatures().map(
        (feature) =>
          new CreatePlanFeatureResponseDto({
            id: feature.id,
            code: feature.code,
            value: feature.value,
            sortOrder: feature.sortOrder,
            active: feature.active,
            translations: feature.getAllTranslations().map(
              (translation) =>
                new CreatePlanFeatureTranslationResponseDto({
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
