import type { SynchronizableVpnSubscriptionData } from './SynchronizableVpnSubscriptionData.js';
import type { VpnSubscriptionRecord } from './VpnSubscriptionRecord.js';

export class VpnSubscription {
  static hydrate(
    record: VpnSubscriptionRecord,
  ): VpnSubscription {
    return new VpnSubscription(record);
  }

  static create(props: {
    id?: VpnSubscriptionRecord['id'];
    provider: VpnSubscriptionRecord['provider'];
    externalId: VpnSubscriptionRecord['externalId'];
    subscriptionUrl: VpnSubscriptionRecord['subscriptionUrl'];
    userId: VpnSubscriptionRecord['userId'];
    createdAt?: VpnSubscriptionRecord['createdAt'];
    updatedAt?: VpnSubscriptionRecord['updatedAt'];
  }): VpnSubscription {
    return new VpnSubscription({
      id: props.id ?? crypto.randomUUID(),
      provider: props.provider,
      externalId: props.externalId,
      subscriptionUrl: props.subscriptionUrl,
      userId: props.userId,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  private constructor(
    private readonly props: VpnSubscriptionRecord,
  ) {}

  get id(): VpnSubscriptionRecord['id'] {
    return this.props.id;
  }

  get provider(): VpnSubscriptionRecord['provider'] {
    return this.props.provider;
  }

  get externalId(): VpnSubscriptionRecord['externalId'] {
    return this.props.externalId;
  }

  get subscriptionUrl(): VpnSubscriptionRecord['subscriptionUrl'] {
    return this.props.subscriptionUrl;
  }

  get userId(): VpnSubscriptionRecord['userId'] {
    return this.props.userId;
  }

  get createdAt(): VpnSubscriptionRecord['createdAt'] {
    return this.props.createdAt;
  }

  get updatedAt(): VpnSubscriptionRecord['updatedAt'] {
    return this.props.updatedAt;
  }

  syncFromExternal(
    data: SynchronizableVpnSubscriptionData,
  ): VpnSubscription {
    return VpnSubscription.hydrate({
      ...this.props,
      provider: data.provider,
      externalId: data.externalId,
      subscriptionUrl: data.subscriptionUrl,
      updatedAt: new Date(),
    });
  }

  toRecord(): VpnSubscriptionRecord {
    return {
      ...this.props,
    };
  }
}
