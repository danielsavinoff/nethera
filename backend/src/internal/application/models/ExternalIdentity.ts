export enum Provider {
  Bitrix = 'bitrix',
}

export interface ExternalIdentity {
  id: number;
  provider: Provider;
}
