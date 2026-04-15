export enum Provider {
  Bitrix = 'bitrix',
}

export interface ExternalIdentity {
  externalId: number;
  provider: Provider;
}
