import { UnknownCurrencyException } from './UnknownCurrencyException.js';
import { SupportedCurrency } from './SupportedCurrency.js';

export class Money {
  static readonly currencyScale: Record<SupportedCurrency, number> = {
    [SupportedCurrency.RUB]: 2,
    [SupportedCurrency.EUR]: 2,
    [SupportedCurrency.USD]: 2,
  };

  static toMinor(amount: number, currency: string): number {
    const scale = this.currencyScale[currency];

    if (scale === undefined) {
      throw new UnknownCurrencyException();
    }

    return Math.round(amount * 10 ** scale);
  }

  static fromMinor(
    amountMinor: number,
    currency: string,
  ): number {
    const scale = this.currencyScale[currency];

    if (scale === undefined) {
      throw new UnknownCurrencyException();
    }

    return Number(amountMinor) / 10 ** scale;
  }
}
