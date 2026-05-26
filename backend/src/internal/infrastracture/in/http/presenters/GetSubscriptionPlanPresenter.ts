import { Injectable } from '@nestjs/common';
import { GetSubscriptionPlanResult } from '../../../../application/usecases/GetSubscriptionPlanUseCase.js';
import { MoneyFormatter } from '../../../../domain/money/MoneyFormatter.js';
import { SubscriptionPlan } from '../../../../domain/subscription/SubscriptionPlan.js';
import { SubscriptionPlanTranslation } from '../../../../domain/subscription/SubscriptionPlanTranslation.js';
import { GetSubscriptionPlanFeatureResponseDto } from '../dtos/GetSubscriptionPlanFeatureResponseDto.js';
import { GetSubscriptionPlanPriceResponseDto } from '../dtos/GetSubscriptionPlanPriceResponseDto.js';
import { GetSubscriptionPlanResponseDto } from '../dtos/GetSubscriptionPlanResponseDto.js';

@Injectable()
export class GetSubscriptionPlanPresenter {
  present(
    result: GetSubscriptionPlanResult,
  ): GetSubscriptionPlanResponseDto {
    const translation = this.getTranslation(
      result.data.subscriptionPlan,
      result.data.locale,
    );

    const price = this.getPrice(
      result.data.subscriptionPlan,
      result.data.locale,
      result.data.currencyCode,
    );

    return new GetSubscriptionPlanResponseDto({
      id: result.data.subscriptionPlan.id,
      code: result.data.subscriptionPlan.code,
      billingInterval:
        result.data.subscriptionPlan.billingInterval,
      billingIntervalCount:
        result.data.subscriptionPlan.billingIntervalCount,
      trialDays: result.data.subscriptionPlan.trialDays,
      isPublic: result.data.subscriptionPlan.isPublic,
      name: translation?.name,
      description: translation?.description,
      features: result.data.subscriptionPlan
        .getAllFeatures()
        .map((feature) => {
          const translation = feature.getAllTranslations()[0];

          return new GetSubscriptionPlanFeatureResponseDto({
            sortOrder: feature.sortOrder,
            title: translation?.title,
            description: translation?.description,
          });
        }),
      price,
    });
  }

  private getTranslation(
    subscriptionPlan: SubscriptionPlan,
    locale: string,
  ): SubscriptionPlanTranslation | null {
    return (
      subscriptionPlan.getTranslation(locale) ??
      subscriptionPlan.getAllTranslations()[0] ??
      null
    );
  }

  private getPrice(
    subscriptionPlan: SubscriptionPlan,
    locale: string,
    currencyCode: string,
  ): GetSubscriptionPlanPriceResponseDto | undefined {
    const price = subscriptionPlan
      .getAllPrices()
      .find(
        (subscriptionPrice) =>
          subscriptionPrice.active &&
          subscriptionPrice.currencyCode === currencyCode,
      );

    return price
      ? new GetSubscriptionPlanPriceResponseDto({
          currencyCode: price.currencyCode,
          amountMinor: price.amountMinor,
          formatted: MoneyFormatter.format(
            price.amountMinor,
            locale,
            price.currencyCode,
          ),
        })
      : undefined;
  }
}
