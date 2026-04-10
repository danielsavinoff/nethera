import { SessionRecord } from '../../domain/user/SessionRecord.js';
import { Session } from '../../domain/user/Session.js';

export interface SessionRepository {
  save(session: Session): Promise<Session>;
  deleteById(id: SessionRecord['id']): Promise<void>;
  loadByIdOrThrow(id: SessionRecord['id']): Promise<Session>;
}
