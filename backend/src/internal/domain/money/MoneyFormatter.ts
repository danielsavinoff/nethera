import { Money } from './Money.js';

export class MoneyFormatter {
  private static localeCurrency: Record<string, string> = {
    en: 'USD',
    'en-US': 'USD',
    ru: 'RUB',
    'ru-RU': 'RUB',
  };

  static format(amountMinor: number, locale: string): string {
    const currency = this.getCurrency(locale);

    const amount = Money.fromMinor(amountMinor, currency);

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: Number.isInteger(amount)
        ? 0
        : undefined,
    }).format(amount);
  }

  static getCurrency(locale: string): string {
    return this.localeCurrency[locale] ?? this.localeCurrency.en;
  }
}
