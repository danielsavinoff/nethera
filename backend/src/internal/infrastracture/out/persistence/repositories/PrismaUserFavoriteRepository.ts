import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserFavoriteNotFoundException } from '../../../../application/exceptions/UserFavoriteNotFoundException.js';
import type { UserFavoriteRepository } from '../../../../application/ports/UserFavoriteRepository.js';
import { UserFavorite } from '../../../../domain/user/UserFavorite.js';
import type { UserRecord } from '../../../../domain/user/UserRecord.js';

@Injectable()
export class PrismaUserFavoriteRepository
  implements UserFavoriteRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async loadAllByUserId(
    userId: UserRecord['id'],
  ): Promise<UserFavorite[]> {
    const rows = await this.prisma.userFavorite.findMany({
      where: {
        favoriter_user_id: userId,
      },
      orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
    });

    return rows.map((row) =>
      UserFavorite.hydrate({
        id: row.id,
        favoriterUserId: row.favoriter_user_id,
        favoritedUserId: row.favorited_user_id,
        createdAt: row.created_at,
      }),
    );
  }

  async loadByIdOrThrow(
    id: UserFavorite['id'],
  ): Promise<UserFavorite> {
    const row = await this.prisma.userFavorite.findUnique({
      where: { id },
    });

    if (!row) {
      throw new UserFavoriteNotFoundException();
    }

    return UserFavorite.hydrate({
      id: row.id,
      favoriterUserId: row.favoriter_user_id,
      favoritedUserId: row.favorited_user_id,
      createdAt: row.created_at,
    });
  }

  async save(userFavorite: UserFavorite): Promise<UserFavorite> {
    const record = userFavorite.toRecord();
    const row = await this.prisma.userFavorite.upsert({
      where: {
        favoriter_user_id_favorited_user_id: {
          favoriter_user_id: record.favoriterUserId,
          favorited_user_id: record.favoritedUserId,
        },
      },
      create: {
        id: record.id,
        favoriter_user_id: record.favoriterUserId,
        favorited_user_id: record.favoritedUserId,
        created_at: record.createdAt,
      },
      update: {},
    });

    return UserFavorite.hydrate({
      id: row.id,
      favoriterUserId: row.favoriter_user_id,
      favoritedUserId: row.favorited_user_id,
      createdAt: row.created_at,
    });
  }

  async deleteById(id: UserFavorite['id']): Promise<void> {
    await this.prisma.userFavorite.delete({
      where: { id },
    });
  }
}
