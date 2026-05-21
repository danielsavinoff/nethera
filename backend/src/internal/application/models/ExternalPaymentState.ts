export enum ExternalPaymentStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED',
  Failed = 'FAILED',
}

export interface ExternalPaymentState {
  externalId: string;
  status: ExternalPaymentStatus;
}
