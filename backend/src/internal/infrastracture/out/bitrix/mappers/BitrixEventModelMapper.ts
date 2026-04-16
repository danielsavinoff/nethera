import {
  EventHandlerParams,
  EventOnAppInstallHandlerParams,
  EventOnCrmDynamicItemAdd,
  EventOnCrmDynamicItemUpdate,
  EventOnUserAddHandlerParams,
} from '@bitrix24/b24jssdk';
import { Injectable } from '@nestjs/common';
import { UnsupportedBitrixEventException } from '../exceptions/UnsupportedBitrixEventException.js';
import { ResolveEntityFailureException } from '../exceptions/ResolveEntityFailureException.js';
import {
  SupportedBitrixEvents,
  SupportedBitrixEventsToModels,
} from '../enums/SupportedBitrixEventsToModels.js';
import { IncomingWebhookPayload } from '../../../../application/models/IncomingWebhookPayload.js';

const BITRIX_EVENT_RESOLVERS: Record<
  string,
  (
    data: any,
  ) =>
    | SupportedBitrixEventsToModels[SupportedBitrixEvents]
    | undefined
> = {
  [SupportedBitrixEvents.OnUserAdd]: (
    event: EventOnUserAddHandlerParams,
  ) => {
    const entityId = event.data.ID?.valueOf();

    if (!entityId) {
      return;
    }

    return {
      id: entityId,
    };
  },
  [SupportedBitrixEvents.OnAppInstall]: (
    event: EventOnAppInstallHandlerParams,
  ) => {
    return {
      applicationToken: event.auth.application_token,
      clientEndpoint: event.auth.client_endpoint,
      serverEndpoint: event.auth.server_endpoint,
    };
  },
  [SupportedBitrixEvents.OnCrmDynamicItemAdd]: (
    event: EventOnCrmDynamicItemAdd,
  ) => {
    return {
      externalSmartProcessId: event.FIELDS.ENTITY_TYPE_ID,
      externalId: event.FIELDS.ID,
    };
  },
  [SupportedBitrixEvents.OnCrmDynamicItemUpdate]: (
    event: EventOnCrmDynamicItemUpdate,
  ) => {
    return {
      externalSmartProcessId: event.FIELDS.ENTITY_TYPE_ID,
      externalId: event.FIELDS.ID,
    };
  },
};

@Injectable()
export class BitrixEventModelMapper {
  map(event: EventHandlerParams): IncomingWebhookPayload {
    if (!this.supports(event.event)) {
      throw new UnsupportedBitrixEventException();
    }

    const resolver = BITRIX_EVENT_RESOLVERS[event.event];

    if (!resolver) {
      throw new ResolveEntityFailureException();
    }

    const result = resolver(event as never);

    if (!result) {
      throw new ResolveEntityFailureException();
    }

    return result;
  }

  private supports(eventName: string) {
    const supportedEvents = Object.values(
      SupportedBitrixEvents,
    ) as string[];

    return supportedEvents.includes(eventName);
  }
}
