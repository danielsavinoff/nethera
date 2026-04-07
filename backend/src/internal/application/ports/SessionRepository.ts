import { SessionRecord } from '../../domain/user/SessionRecord.js';
import { Session } from '../../domain/user/Session.js';

export interface CreateSessionData {
  id: string;
  refreshToken: string;
  userId: string;
  expiresAt: Date;
}

export interface SessionRepository {
  save(session: Session): Promise<Session>;
  deleteById(id: SessionRecord['id']): Promise<void>;
  findById(id: SessionRecord['id']): Promise<Session | null>;
}
