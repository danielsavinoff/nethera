import type { ExternalGroupReference } from '../../../../application/models/ExternalGroupReference.js';
import type { ExternalSmartProcessReference } from '../../../../application/models/ExternalSmartProcessReference.js';
import type { ExternalTaskReference } from '../../../../application/models/ExternalTaskReference.js';
import type { ConnectionInfo } from '../../../../application/models/ConnectionInfo.js';
import type { ExternalEntity } from '../../../../application/models/ExternalEntity.js';

export enum SupportedBitrixEvents {
  OnUserAdd = 'ONUSERADD',
  OnAppInstall = 'ONAPPINSTALL',
  OnTaskAdd = 'ONTASKADD',
  OnTaskUpdate = 'ONTASKUPDATE',
  OnTaskDelete = 'ONTASKDELETE',
  OnSonetGroupAdd = 'ONSONETGROUPADD',
  OnSonetGroupUpdate = 'ONSONETGROUPUPDATE',
  OnSonetGroupDelete = 'ONSONETGROUPDELETE',
  OnCrmDynamicItemAdd = 'ONCRMDYNAMICITEMADD',
  OnCrmDynamicItemUpdate = 'ONCRMDYNAMICITEMUPDATE',
  OnCrmDynamicItemDelete = 'ONCRMDYNAMICITEMDELETE',
}

export interface SupportedBitrixEventsToModels {
  [SupportedBitrixEvents.OnUserAdd]: ExternalEntity;
  [SupportedBitrixEvents.OnAppInstall]: ConnectionInfo;
  [SupportedBitrixEvents.OnTaskAdd]: ExternalTaskReference;
  [SupportedBitrixEvents.OnTaskUpdate]: ExternalTaskReference;
  [SupportedBitrixEvents.OnTaskDelete]: ExternalTaskReference;
  [SupportedBitrixEvents.OnSonetGroupAdd]: ExternalGroupReference;
  [SupportedBitrixEvents.OnSonetGroupUpdate]: ExternalGroupReference;
  [SupportedBitrixEvents.OnSonetGroupDelete]: ExternalGroupReference;
  [SupportedBitrixEvents.OnCrmDynamicItemAdd]: ExternalSmartProcessReference;
  [SupportedBitrixEvents.OnCrmDynamicItemUpdate]: ExternalSmartProcessReference;
  [SupportedBitrixEvents.OnCrmDynamicItemDelete]: ExternalSmartProcessReference;
}
