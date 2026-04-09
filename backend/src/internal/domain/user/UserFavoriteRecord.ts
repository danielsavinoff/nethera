import type { UserRecord } from './UserRecord.js';

export interface UserFavoriteRecord {
  id: string;
  favoriterUserId: UserRecord['id'];
  favoritedUserId: UserRecord['id'];
  createdAt: Date;
}
