import { Injectable } from '@nestjs/common';
import { GetSubscriptionPlansResult } from '../../../../application/usecases/GetSubscriptionPlansUseCase.js';
import { MoneyFormatter } from '../../../../domain/money/MoneyFormatter.js';
import { SubscriptionPlan } from '../../../../domain/subscription/SubscriptionPlan.js';
import { SubscriptionPlanTranslation } from '../../../../domain/subscription/SubscriptionPlanTranslation.js';
import { GetSubscriptionPlanFeatureResponseDto } from '../dtos/GetSubscriptionPlanFeatureResponseDto.js';
import { GetSubscriptionPlanPriceResponseDto } from '../dtos/GetSubscriptionPlanPriceResponseDto.js';
import { GetSubscriptionPlanResponseDto } from '../dtos/GetSubscriptionPlanResponseDto.js';
import { GetSubscriptionPlansResponseDto } from '../dtos/GetSubscriptionPlansResponseDto.js';

@Injectable()
export class GetSubscriptionPlansPresenter {
  present(
    result: GetSubscriptionPlansResult,
  ): GetSubscriptionPlansResponseDto {
    return new GetSubscriptionPlansResponseDto({
      subscriptionPlans: result.data.subscriptionPlans.map(
        (subscriptionPlan) =>
          this.presentSubscriptionPlan(
            subscriptionPlan,
            result.data.locale,
            result.data.currencyCode,
          ),
      ),
    });
  }

  private presentSubscriptionPlan(
    subscriptionPlan: SubscriptionPlan,
    locale: string,
    currencyCode: string,
  ): GetSubscriptionPlanResponseDto {
    const translation = this.getTranslation(
      subscriptionPlan,
      locale,
    );
    const price = this.getPrice(
      subscriptionPlan,
      locale,
      currencyCode,
    );

    return new GetSubscriptionPlanResponseDto({
      id: subscriptionPlan.id,
      code: subscriptionPlan.code,
      billingInterval: subscriptionPlan.billingInterval,
      billingIntervalCount:
        subscriptionPlan.billingIntervalCount,
      trialDays: subscriptionPlan.trialDays,
      isPublic: subscriptionPlan.isPublic,
      name: translation?.name,
      description: translation?.description,
      features: subscriptionPlan
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
