export enum TranslationKey {
  SubscriptionPlanInvoiceLineTitle = 'SUBSCRIPTION_PLAN_INVOICE_LINE_TITLE',
}

export type TranslatableOptionsMap = {
  [TranslationKey.SubscriptionPlanInvoiceLineTitle]: {
    planTitle: string;
    interval: string;
    count: number;
  };
};

export type TranslatableOptions<T extends TranslationKey> =
  TranslatableOptionsMap[T];

export interface Translator {
  translate<T extends TranslationKey>(
    key: T,
    options: TranslatableOptions<T>,
  ): string;
}

export interface TranslatorFactory {
  forLocale(locale: string): Translator;
}
