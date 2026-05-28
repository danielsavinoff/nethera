import { BillingProvider } from '../../domain/subscription/BillingProvider.js';

export type GetBillingProvidersCommand = Record<string, never>;

export interface GetBillingProvidersResult {
  data: {
    providers: BillingProvider[];
  };
}

export class GetBillingProvidersUseCase {
  execute(command: GetBillingProvidersCommand): GetBillingProvidersResult {
    void command;

    return {
      data: {
        providers: Object.values(BillingProvider),
      },
    };
  }
}
