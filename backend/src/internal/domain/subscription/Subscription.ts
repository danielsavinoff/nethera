import { Duration } from '../time/Duration.js';
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
    expiresAt?: SubscriptionRecord['expiresAt'];
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
        expiresAt: props.expiresAt,
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

  get expiresAt(): SubscriptionRecord['expiresAt'] {
    return this.props.expiresAt;
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

  isActive(): boolean {
    return this.props.status === SubscriptionStatus.Active;
  }

  isActivated(): boolean {
    return !!this.props.startedAt;
  }

  isInfinite(): boolean {
    return !this.props.expiresAt;
  }

  private activate(duration?: Duration): Subscription {
    if (this.isActivated()) {
      throw new Error('already activated');
    }

    const now = new Date();
    const expiration = duration?.addTo(now);

    return new Subscription(
      {
        ...this.props,
        status: SubscriptionStatus.Active,
        startedAt: now,
        expiresAt: expiration,
      },
      this.subscriptionPlan,
    );
  }

  private extend(duration: Duration): Subscription {
    if (!this.isActivated()) {
      throw new Error('is not activated yet');
    }

    if (this.isInfinite()) {
      throw new Error('cannot extend infinite sub');
    }

    const now = new Date();

    const previousExpiration = this.props.expiresAt!;

    const extensionBase =
      now > previousExpiration ? now : previousExpiration;

    return new Subscription(
      {
        ...this.props,
        status: SubscriptionStatus.Active,
        expiresAt: duration.addTo(extensionBase),
      },
      this.subscriptionPlan,
    );
  }

  private limit(duration: Duration): Subscription {
    if (!this.isInfinite()) {
      throw new Error('already finite');
    }

    if (!this.isActive()) {
      throw new Error('is not yet active');
    }

    const now = new Date();

    return new Subscription(
      {
        ...this.props,
        expiresAt: duration.addTo(now),
      },
      this.subscriptionPlan,
    );
  }

  private unlimit(): Subscription {
    if (this.isInfinite()) {
      throw new Error('already infinite');
    }

    return new Subscription(
      {
        ...this.props,
        expiresAt: undefined,
      },
      this.subscriptionPlan,
    );
  }

  renew(duration?: Duration): Subscription {
    if (!this.isActivated()) {
      return this.activate(duration);
    }

    if (!duration) {
      if (this.isInfinite()) {
        return this;
      }

      return this.unlimit();
    }

    if (!this.isInfinite()) {
      return this.extend(duration);
    }

    return this.limit(duration);
  }

  getPlan(): SubscriptionPlan | null {
    return this.subscriptionPlan ?? null;
  }

  isPlanLoaded(): this is this & {
    getPlan(): SubscriptionPlan;
  } {
    return !!this.subscriptionPlan;
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
