import type { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import type { ExternalSmartProcessField } from '../models/ExternalSmartProcessField.js';

export interface CreateSmartProcessFieldsInput {
  smartProcessExternalId: string;
  fields: ExternalSmartProcessField[];
}

export interface SmartProcessFieldProvider {
  createMany(
    credentials: TenantCredentials,
    input: CreateSmartProcessFieldsInput,
  ): Promise<void>;
}
