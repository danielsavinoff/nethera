import { SupportedCurrency } from '../../domain/money/SupportedCurrency.js';

export type GetSupportedCurrenciesCommand = Record<string, never>;

export interface GetSupportedCurrenciesResult {
  data: {
    currencies: SupportedCurrency[];
  };
}

export class GetSupportedCurrenciesUseCase {
  execute(
    command: GetSupportedCurrenciesCommand,
  ): GetSupportedCurrenciesResult {
    void command;

    return {
      data: {
        currencies: Object.values(SupportedCurrency),
      },
    };
  }
}
