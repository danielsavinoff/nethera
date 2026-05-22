import { UnknownCurrencyException } from './UnknownCurrencyException.js';

export class Money {
  static readonly currencyScale = {
    USD: 2,
    EUR: 2,
    RUB: 2,
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
