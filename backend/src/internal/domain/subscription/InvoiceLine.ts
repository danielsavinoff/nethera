import { InvalidInvoiceLineTypeException } from './InvalidInvoiceLineTypeException.js';
import { InvoiceLineRecord } from './InvoiceLineRecord.js';
import { InvoiceLineType } from './InvoiceLineType.js';

export class InvoiceLine {
  static hydrate(record: InvoiceLineRecord): InvoiceLine {
    return new InvoiceLine(record);
  }

  static create(props: {
    id?: InvoiceLineRecord['id'];
    referenceId: InvoiceLineRecord['referenceId'];
    type: InvoiceLineType;
    amount: InvoiceLineRecord['amount'];
    invoiceId: InvoiceLineRecord['invoiceId'];
  }): InvoiceLine {
    return new InvoiceLine({
      id: props.id ?? crypto.randomUUID(),
      referenceId: props.referenceId,
      type: props.type,
      amount: props.amount,
      invoiceId: props.invoiceId,
    });
  }

  private constructor(
    private readonly props: InvoiceLineRecord,
  ) {}

  get id(): InvoiceLineRecord['id'] {
    return this.props.id;
  }

  get referenceId(): InvoiceLineRecord['referenceId'] {
    return this.props.referenceId;
  }

  get type(): InvoiceLineType {
    if (
      !Object.values(InvoiceLineType).includes(
        this.props.type as InvoiceLineType,
      )
    ) {
      throw new InvalidInvoiceLineTypeException(this.props.type);
    }

    return this.props.type as InvoiceLineType;
  }

  get amount(): InvoiceLineRecord['amount'] {
    return this.props.amount;
  }

  get invoiceId(): InvoiceLineRecord['invoiceId'] {
    return this.props.invoiceId;
  }

  toRecord(): InvoiceLineRecord {
    return {
      ...this.props,
    };
  }
}
