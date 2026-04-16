import { ConnectionInfo } from './ConnectionInfo.js';
import { ExternalEntity } from './ExternalEntity.js';
import { ExternalGroupReference } from './ExternalGroupReference.js';
import { ExternalSmartProcessReference } from './ExternalSmartProcessReference.js';
import { ExternalTaskReference } from './ExternalTaskReference.js';

export type IncomingWebhookPayload =
  | ConnectionInfo
  | ExternalEntity
  | ExternalTaskReference
  | ExternalGroupReference
  | ExternalSmartProcessReference;
