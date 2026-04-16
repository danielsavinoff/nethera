import { ConnectionInfo } from './ConnectionInfo.js';
import { Entity } from './Entity.js';
import { ExternalSmartProcessReference } from './ExternalSmartProcessReference.js';

export type IncomingWebhookPayload =
  | ConnectionInfo
  | Entity
  | ExternalSmartProcessReference;
