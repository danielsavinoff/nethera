import { PrismaClient } from '@prisma/client';
import type { SessionRepository } from '../../../../application/ports/SessionRepository.js';
import { SessionNotFoundException } from '../../../../application/exceptions/SessionNotFoundException.js';
import type { SessionRecord } from '../../../../domain/user/SessionRecord.js';
import { Injectable } from '@nestjs/common';
import { Session } from '../../../../domain/user/Session.js';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async deleteById(id: SessionRecord['id']): Promise<void> {
    await this.prisma.session.delete({
      where: { id },
    });
  }

  async loadByIdOrThrow(
    id: SessionRecord['id'],
  ): Promise<Session> {
    const row = await this.prisma.session.findUnique({
      where: { id },
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
