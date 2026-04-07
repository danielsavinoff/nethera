export enum Provider {
  Bitrix = 'bitrix',
}

export interface ProviderIdentity {
  externalId: number;
  provider: Provider;
}
