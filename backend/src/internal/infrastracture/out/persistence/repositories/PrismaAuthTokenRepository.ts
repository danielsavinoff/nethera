import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import type {
  AuthTokenRepository,
  LoadAuthTokenQuery,
} from '../../../../application/ports/AuthTokenRepository.js';
import { AuthToken } from '../../../../domain/user/AuthToken.js';

@Injectable()
export class PrismaAuthTokenRepository
  implements AuthTokenRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async load(
    query: LoadAuthTokenQuery,
  ): Promise<AuthToken | null> {
    const row = await this.prisma.authToken.findUnique({
      where: {
        token_hash: query.filters.tokenHash,
      },
    });

    if (!row) {
      return null;
    }

    return AuthToken.hydrate({
      id: row.id,
      email: row.email,
      tokenHash: row.token_hash,
      requestedIp: row.requested_ip ?? undefined,
      requestedUserAgent: row.requested_user_agent ?? undefined,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      usedAt: row.used_at ?? undefined,
    });
  }

  async save(authToken: AuthToken): Promise<AuthToken> {
    const record = authToken.toRecord();

    const row = await this.prisma.authToken.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        email: record.email,
        token_hash: record.tokenHash,
        requested_ip: record.requestedIp,
        requested_user_agent: record.requestedUserAgent,
        created_at: record.createdAt,
        expires_at: record.expiresAt,
        used_at: record.usedAt,
      },
      update: {
        email: record.email,
        token_hash: record.tokenHash,
        requested_ip: record.requestedIp,
        requested_user_agent: record.requestedUserAgent,
        created_at: record.createdAt,
        expires_at: record.expiresAt,
        used_at: record.usedAt,
      },
    });

    return AuthToken.hydrate({
      id: row.id,
      email: row.email,
      tokenHash: row.token_hash,
      requestedIp: row.requested_ip ?? undefined,
      requestedUserAgent: row.requested_user_agent ?? undefined,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      usedAt: row.used_at ?? undefined,
    });
  }
}
