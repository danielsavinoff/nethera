import type { UserFavorite } from '../../domain/user/UserFavorite.js';
import type { UserRecord } from '../../domain/user/UserRecord.js';

export interface UserFavoriteRepository {
  loadAllByUserId(
    userId: UserRecord['id'],
  ): Promise<UserFavorite[]>;
  loadByIdOrThrow(id: UserFavorite['id']): Promise<UserFavorite>;
  save(userFavorite: UserFavorite): Promise<UserFavorite>;
  deleteById(id: UserFavorite['id']): Promise<void>;
}
