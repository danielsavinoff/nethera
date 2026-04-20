import { BillingInterval } from './BillingInterval.js';
import { InvalidPlanBillingIntervalException } from './InvalidPlanBillingIntervalException.js';
import { PlanRecord } from './PlanRecord.js';

export class Plan {
  static hydrate(record: PlanRecord): Plan {
    return new Plan(record);
  }

  static create(props: {
    id?: PlanRecord['id'];
    code: PlanRecord['code'];
    name: PlanRecord['name'];
    priceAmount: PlanRecord['priceAmount'];
    priceCurrency: PlanRecord['priceCurrency'];
    billingInterval: BillingInterval;
    billingIntervalCount?: PlanRecord['billingIntervalCount'];
    trialDays?: PlanRecord['trialDays'];
    active?: PlanRecord['active'];
    createdAt?: PlanRecord['createdAt'];
    updatedAt?: PlanRecord['updatedAt'];
  }): Plan {
    return new Plan({
      id: props.id ?? crypto.randomUUID(),
      code: props.code,
      name: props.name,
      priceAmount: props.priceAmount,
      priceCurrency: props.priceCurrency,
      billingInterval: props.billingInterval,
      billingIntervalCount: props.billingIntervalCount ?? 1,
      trialDays: props.trialDays,
      active: props.active ?? true,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  private constructor(private readonly props: PlanRecord) {}

  get id(): PlanRecord['id'] {
    return this.props.id;
  }

  get code(): PlanRecord['code'] {
    return this.props.code;
  }

  get name(): PlanRecord['name'] {
    return this.props.name;
  }

  get priceAmount(): PlanRecord['priceAmount'] {
    return this.props.priceAmount;
  }

  get priceCurrency(): PlanRecord['priceCurrency'] {
    return this.props.priceCurrency;
  }

  get billingInterval(): BillingInterval {
    if (
      !Object.values(BillingInterval).includes(
        this.props.billingInterval as BillingInterval,
      )
    ) {
      throw new InvalidPlanBillingIntervalException(
        this.props.billingInterval,
      );
    }

    return this.props.billingInterval as BillingInterval;
  }

  get billingIntervalCount(): PlanRecord['billingIntervalCount'] {
    return this.props.billingIntervalCount;
  }

  get trialDays(): PlanRecord['trialDays'] {
    return this.props.trialDays;
  }

  get active(): PlanRecord['active'] {
    return this.props.active;
  }

  get createdAt(): PlanRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): PlanRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  toRecord(): PlanRecord {
    return {
      ...this.props,
    };
  }
}
