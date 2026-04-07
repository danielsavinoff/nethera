import { ConnectionInfo } from '../../../../application/models/ConnectionInfo.js';
import type { Entity } from '../../../../application/models/Entity.js';

export enum SupportedBitrixEvents {
  OnUserAdd = 'ONUSERADD',
  OnAppInstall = 'ONAPPINSTALL',
}

export interface SupportedBitrixEventsToModels {
  [SupportedBitrixEvents.OnUserAdd]: Entity;
  [SupportedBitrixEvents.OnAppInstall]: ConnectionInfo;
}
