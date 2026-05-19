import { SessionRecord } from '../../domain/user/SessionRecord.js';
import { Session } from '../../domain/user/Session.js';

export interface DeleteSessionQuery {
  filters: {
    id: SessionRecord['id'];
  };
}

export interface LoadSessionQuery {
  filters: {
    id: SessionRecord['id'];
  };
}

export interface SessionRepository {
  save(session: Session): Promise<Session>;
  delete(query: DeleteSessionQuery): Promise<void>;
  loadOrThrow(query: LoadSessionQuery): Promise<Session>;
}
