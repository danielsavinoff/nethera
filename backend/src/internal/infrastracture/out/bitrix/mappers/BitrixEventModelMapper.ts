import {
  EventHandlerParams,
  EventOnAppInstallHandlerParams,
  EventOnCrmDynamicItemAdd,
  EventOnCrmDynamicItemDelete,
  EventOnTaskUpdateHandlerParams,
  EventOnCrmDynamicItemUpdate,
  EventOnSonetGroupAddHandlerParams,
  EventOnSonetGroupDeleteHandlerParams,
  EventOnSonetGroupUpdateHandlerParams,
  EventOnTaskAddHandlerParams,
  EventOnTaskDeleteHandlerParams,
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
    const externalId = event.data.ID?.valueOf();

    if (!externalId) {
      return;
    }

    return {
      externalId: externalId,
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
  [SupportedBitrixEvents.OnTaskAdd]: (
    event: EventOnTaskAddHandlerParams,
  ) => {
    const externalId =
      event.data.FIELDS_AFTER?.ID.valueOf() ||
      event.data.FIELDS_BEFORE?.ID.valueOf();

    if (!externalId) {
      return;
    }

    return {
      externalId: externalId,
    };
  },
  [SupportedBitrixEvents.OnTaskUpdate]: (
    event: EventOnTaskUpdateHandlerParams,
  ) => {
    const externalId =
      event.data.FIELDS_AFTER?.ID.valueOf() ||
      event.data.FIELDS_BEFORE?.ID.valueOf();

    if (!externalId) {
      return;
    }

    return {
      externalId: externalId,
    };
  },
  [SupportedBitrixEvents.OnTaskDelete]: (
    event: EventOnTaskDeleteHandlerParams,
  ) => {
    const externalId =
      event.data.FIELDS_AFTER?.ID.valueOf() ||
      event.data.FIELDS_BEFORE?.ID.valueOf();

    if (!externalId) {
      return;
    }

    return {
      externalId: externalId,
    };
  },
  [SupportedBitrixEvents.OnSonetGroupAdd]: (
    event: EventOnSonetGroupAddHandlerParams,
  ) => {
    const externalId = event.data.FIELDS.ID;

    if (!externalId) {
      return;
    }

    return {
      externalId: String(externalId),
    };
  },
  [SupportedBitrixEvents.OnSonetGroupUpdate]: (
    event: EventOnSonetGroupUpdateHandlerParams,
  ) => {
    const externalId = event.data.FIELDS.ID;

    if (!externalId) {
      return;
    }

    return {
      externalId: String(externalId),
    };
  },
  [SupportedBitrixEvents.OnSonetGroupDelete]: (
    event: EventOnSonetGroupDeleteHandlerParams,
  ) => {
    const externalId = event.data.FIELDS.ID;

    if (!externalId) {
      return;
    }

    return {
      externalId: String(externalId),
    };
  },
  [SupportedBitrixEvents.OnCrmDynamicItemAdd]: (
    event: EventOnCrmDynamicItemAdd,
  ) => {
    const externalSmartProcessId =
      event.data.FIELDS.ENTITY_TYPE_ID;
    const externalId = event.data.FIELDS.ID;

    if (!externalSmartProcessId || !externalId) {
      return;
    }

    return {
      externalSmartProcessId,
      externalId,
    };
  },
  [SupportedBitrixEvents.OnCrmDynamicItemUpdate]: (
    event: EventOnCrmDynamicItemUpdate,
  ) => {
    const externalSmartProcessId =
      event.data.FIELDS.ENTITY_TYPE_ID;
    const externalId = event.data.FIELDS.ID;

    if (!externalSmartProcessId || !externalId) {
      return;
    }

    return {
      externalSmartProcessId,
      externalId,
    };
  },
  [SupportedBitrixEvents.OnCrmDynamicItemDelete]: (
    event: EventOnCrmDynamicItemDelete,
  ) => {
    const externalSmartProcessId =
      event.data.FIELDS.ENTITY_TYPE_ID;
    const externalId = event.data.FIELDS.ID;

    if (!externalSmartProcessId || !externalId) {
      return;
    }

    return {
      externalSmartProcessId,
      externalId,
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
