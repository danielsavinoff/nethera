import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ExternalSmartProcessFieldCreationFailedException } from '../../../../application/exceptions/ExternalSmartProcessFieldCreationFailedException.js';
import {
  CreateSmartProcessFieldsInput,
  SmartProcessFieldProvider,
} from '../../../../application/ports/SmartProcessFieldProvider.js';
import { ExternalSmartProcessFieldType } from '../../../../application/models/ExternalSmartProcessField.js';
import { ExternalSmartProcessNotFoundException } from '../../../../application/exceptions/ExternalSmartProcessNotFoundException.js';
import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { BitrixClient } from '../clients/BitrixClient.js';

@Injectable()
export class BitrixSmartProcessFieldProvider
  implements SmartProcessFieldProvider
{
  constructor(
    private readonly bitrixClient: BitrixClient,
    private readonly i18n: I18nService,
  ) {}

  async createMany(
    credentials: TenantCredentials,
    input: CreateSmartProcessFieldsInput,
  ): Promise<void> {
    const smartProcess =
      await this.bitrixClient.getSmartProcessByEntityTypeId(
        input.smartProcessExternalId,
        credentials,
      );

    const fallbackSmartProcess = smartProcess
      ? null
      : await this.bitrixClient.getSmartProcess(
          input.smartProcessExternalId,
          credentials,
        );

    const resolvedSmartProcess =
      smartProcess ?? fallbackSmartProcess;

    if (!resolvedSmartProcess?.id) {
      throw new ExternalSmartProcessNotFoundException();
    }

    const smartProcessId = String(resolvedSmartProcess.id);

    for (const field of input.fields) {
      const key = `common.smartProcess.fields.${field.name}`;

      const mappedField =
        field.type === ExternalSmartProcessFieldType.Text
          ? { userTypeId: 'string' }
          : field.type === ExternalSmartProcessFieldType.Number
            ? { userTypeId: 'double' }
            : field.type ===
                ExternalSmartProcessFieldType.Boolean
              ? { userTypeId: 'boolean' }
              : field.externalLinkedId === 'user'
                ? { userTypeId: 'employee' }
                : {
                    userTypeId: 'crm',
                    settings: {
                      parentEntityTypeId: Number(
                        field.externalLinkedId,
                      ),
                    },
                  };

      const bitrixField =
        await this.bitrixClient.createSmartProcessField(
          credentials,
          {
            smartProcessId,
            fieldName: this.getFieldName(
              smartProcessId,
              field.name,
            ),
            labels: {
              en: String(
                this.i18n.t(key, {
                  lang: 'en',
                  defaultValue: field.name,
                }),
              ),
              ru: String(
                this.i18n.t(key, {
                  lang: 'ru',
                  defaultValue: field.name,
                }),
              ),
            },
            ...mappedField,
          },
        );

      if (!bitrixField?.id) {
        throw new ExternalSmartProcessFieldCreationFailedException();
      }
    }
  }

  private getFieldName(
    smartProcessId: string,
    fieldName: string,
  ): string {
    return `UF_CRM_${smartProcessId}_${fieldName.toUpperCase()}`;
  }
}
