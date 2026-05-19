import { PrismaClient } from '@prisma/client';
import type {
  DeleteSessionQuery,
  LoadSessionQuery,
  SessionRepository,
} from '../../../../application/ports/SessionRepository.js';
import { SessionNotFoundException } from '../../../../application/exceptions/SessionNotFoundException.js';
import { Injectable } from '@nestjs/common';
import { Session } from '../../../../domain/user/Session.js';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async delete(query: DeleteSessionQuery): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { id: query.filters.id },
    });
  }

  async loadOrThrow(query: LoadSessionQuery): Promise<Session> {
    const row = await this.prisma.session.findUnique({
      where: { id: query.filters.id },
    });

    if (!row) {
      throw new SessionNotFoundException();
    }

    return Session.hydrate({
      id: row.id,
      refreshToken: row.refresh_token,
      userId: row.user_id,
      expiresAt: row.expires_at,
    });
  }

  async save(session: Session): Promise<Session> {
    const record = session.toRecord();

    const row = await this.prisma.session.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        refresh_token: record.refreshToken,
        user_id: record.userId,
        expires_at: record.expiresAt,
      },
      update: {
        refresh_token: record.refreshToken,
        user_id: record.userId,
        expires_at: record.expiresAt,
      },
    });

    return Session.hydrate({
      id: row.id,
      refreshToken: row.refresh_token,
      userId: row.user_id,
      expiresAt: row.expires_at,
    });
  }
}
