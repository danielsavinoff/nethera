import { InvalidSubscriptionStatusException } from './InvalidSubscriptionStatusException.js';
import { SubscriptionPlan } from './SubscriptionPlan.js';
import { SubscriptionRecord } from './SubscriptionRecord.js';
import { SubscriptionStatus } from './SubscriptionStatus.js';

export class Subscription {
  static hydrate(record: SubscriptionRecord): Subscription {
    return new Subscription(record);
  }

  static create(props: {
    id?: SubscriptionRecord['id'];
    userId: SubscriptionRecord['userId'];
    subscriptionPlanId: SubscriptionRecord['subscriptionPlanId'];
    status: SubscriptionStatus;
    startedAt: SubscriptionRecord['startedAt'];
    currentPeriodStartAt?: SubscriptionRecord['currentPeriodStartAt'];
    currentPeriodEndAt?: SubscriptionRecord['currentPeriodEndAt'];
    trialStartedAt?: SubscriptionRecord['trialStartedAt'];
    trialEndsAt?: SubscriptionRecord['trialEndsAt'];
    cancelAtPeriodEnd?: SubscriptionRecord['cancelAtPeriodEnd'];
    canceledAt?: SubscriptionRecord['canceledAt'];
    endedAt?: SubscriptionRecord['endedAt'];
    autoRenew?: SubscriptionRecord['autoRenew'];
    subscriptionPlan?: SubscriptionPlan;
    createdAt?: SubscriptionRecord['createdAt'];
    updatedAt?: SubscriptionRecord['updatedAt'];
  }): Subscription {
    return new Subscription(
      {
        id: props.id ?? crypto.randomUUID(),
        userId: props.userId,
        subscriptionPlanId: props.subscriptionPlanId,
        status: props.status,
        startedAt: props.startedAt,
        currentPeriodStartAt: props.currentPeriodStartAt,
        currentPeriodEndAt: props.currentPeriodEndAt,
        trialStartedAt: props.trialStartedAt,
        trialEndsAt: props.trialEndsAt,
        cancelAtPeriodEnd: props.cancelAtPeriodEnd ?? false,
        canceledAt: props.canceledAt,
        endedAt: props.endedAt,
        autoRenew: props.autoRenew ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      props.subscriptionPlan,
    );
  }

  private constructor(
    private readonly props: SubscriptionRecord,
    private readonly subscriptionPlan?: SubscriptionPlan,
  ) {}

  get id(): SubscriptionRecord['id'] {
    return this.props.id;
  }

  get userId(): SubscriptionRecord['userId'] {
    return this.props.userId;
  }

  get subscriptionPlanId(): SubscriptionRecord['subscriptionPlanId'] {
    return this.props.subscriptionPlanId;
  }

  get status(): SubscriptionStatus {
    if (
      !Object.values(SubscriptionStatus).includes(
        this.props.status as SubscriptionStatus,
      )
    ) {
      throw new InvalidSubscriptionStatusException(
        this.props.status,
      );
    }

    return this.props.status as SubscriptionStatus;
  }

  get startedAt(): SubscriptionRecord['startedAt'] {
    return this.props.startedAt;
  }

  get currentPeriodStartAt(): SubscriptionRecord['currentPeriodStartAt'] {
    return this.props.currentPeriodStartAt;
  }

  get currentPeriodEndAt(): SubscriptionRecord['currentPeriodEndAt'] {
    return this.props.currentPeriodEndAt;
  }

  get trialStartedAt(): SubscriptionRecord['trialStartedAt'] {
    return this.props.trialStartedAt;
  }

  get trialEndsAt(): SubscriptionRecord['trialEndsAt'] {
    return this.props.trialEndsAt;
  }

  get cancelAtPeriodEnd(): SubscriptionRecord['cancelAtPeriodEnd'] {
    return this.props.cancelAtPeriodEnd;
  }

  get canceledAt(): SubscriptionRecord['canceledAt'] {
    return this.props.canceledAt;
  }

  get endedAt(): SubscriptionRecord['endedAt'] {
    return this.props.endedAt;
  }

  get autoRenew(): SubscriptionRecord['autoRenew'] {
    return this.props.autoRenew;
  }

  get createdAt(): SubscriptionRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): SubscriptionRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  getPlan(): SubscriptionPlan | null {
    return this.subscriptionPlan ?? null;
  }

  withPlan(subscriptionPlan: SubscriptionPlan): Subscription {
    return new Subscription(this.props, subscriptionPlan);
  }

  toRecord(): SubscriptionRecord {
    return {
      ...this.props,
    };
  }
}
