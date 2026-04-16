import type { ExternalSmartProcessReference } from '../../../../application/models/ExternalSmartProcessReference.js';
import type { ConnectionInfo } from '../../../../application/models/ConnectionInfo.js';
import type { Entity } from '../../../../application/models/Entity.js';

export enum SupportedBitrixEvents {
  OnUserAdd = 'ONUSERADD',
  OnAppInstall = 'ONAPPINSTALL',
  OnCrmDynamicItemAdd = 'ONCRMDYNAMICITEMADD',
  OnCrmDynamicItemUpdate = 'ONCRMDYNAMICITEMUPDATE',
}

export interface SupportedBitrixEventsToModels {
  [SupportedBitrixEvents.OnUserAdd]: Entity;
  [SupportedBitrixEvents.OnAppInstall]: ConnectionInfo;
  [SupportedBitrixEvents.OnCrmDynamicItemAdd]: ExternalSmartProcessReference;
  [SupportedBitrixEvents.OnCrmDynamicItemUpdate]: ExternalSmartProcessReference;
}
