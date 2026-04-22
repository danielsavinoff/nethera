import { PaymentProvider } from '../../domain/subscription/PaymentProvider.js';
import type { PaymentProvider as PaymentProviderPort } from './PaymentProvider.js';

export interface PaymentProviderResolver {
  resolve(provider: PaymentProvider): PaymentProviderPort;
}
