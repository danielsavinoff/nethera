import type { TenantRecord } from '../tenant/TenantRecord.js';
import type { SmartProcessRecord } from './SmartProcessRecord.js';

export class SmartProcess {
  static hydrate(props: SmartProcessRecord): SmartProcess {
    return new SmartProcess(props);
  }

  static create(props: {
    id?: SmartProcessRecord['id'];
    externalId: SmartProcessRecord['externalId'];
    externalTypeId: SmartProcessRecord['externalTypeId'];
    tenantId: TenantRecord['id'];
  }): SmartProcess {
    return new SmartProcess({
      id: props.id ?? crypto.randomUUID(),
      externalId: props.externalId,
      externalTypeId: props.externalTypeId,
      tenantId: props.tenantId,
    });
  }

  static get defaultTitle(): string {
    return 'Test';
  }

  private constructor(
    private readonly props: SmartProcessRecord,
  ) {}

  get id(): SmartProcessRecord['id'] {
    return this.props.id;
  }

  get externalId(): SmartProcessRecord['externalId'] {
    return this.props.externalId;
  }

  get externalTypeId(): SmartProcessRecord['externalTypeId'] {
    return this.props.externalTypeId;
  }

  get tenantId(): SmartProcessRecord['tenantId'] {
    return this.props.tenantId;
  }

  toRecord(): SmartProcessRecord {
    return { ...this.props };
  }
}
