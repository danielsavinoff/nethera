import { defineStore } from "pinia";
import type { components } from "~~/shared/types/generated/api";

type AddUserFavoritesRequestDto =
  components["schemas"]["AddUserFavoritesRequestDto"];
type GetUserFavoriteResponseDto =
  components["schemas"]["GetUserFavoriteResponseDto"];
type GetUserFavoritesResponseDto =
  components["schemas"]["GetUserFavoritesResponseDto"];

type FavoriteUserMenuItem = {
  id: string;
  label: string;
};

export const useFavoriteUsersStore = defineStore("favoriteUsers", {
  state: () => ({
    favoriteUsers: [] as GetUserFavoriteResponseDto[],
    loaded: false,
    loading: false,
  }),

  getters: {
    favoriteUserIds: (state) =>
      [
        ...new Set(
          state.favoriteUsers.map((favorite) => favorite.favoriteUserId),
        ),
      ],
    favoriteItems: (state): FavoriteUserMenuItem[] => {
      const itemsById = new Map<string, FavoriteUserMenuItem>();

      for (const favorite of state.favoriteUsers) {
        if (itemsById.has(favorite.favoriteUserId)) {
          continue;
        }

        itemsById.set(favorite.favoriteUserId, {
          id: favorite.favoriteUserId,
          label: favorite.favoriteUserDisplayName,
        });
      }

      return Array.from(itemsById.values());
    },
  },

  actions: {
    async fetchFavorites(force = false) {
      if (this.loading) {
        return;
      }

      if (this.loaded && !force) {
        return;
      }

      const { $api } = useNuxtApp();

      this.loading = true;

      try {
        const response = await $api<GetUserFavoritesResponseDto>(
          "/api/users/me/favorites",
        );

        this.favoriteUsers = response.favorites;
        this.loaded = true;
      } finally {
        this.loading = false;
      }
    },

    async saveFavoriteUsers(favoriteUserIds: string[]) {
      if (!this.loaded) {
        await this.fetchFavorites();
      }

      const { $api } = useNuxtApp();
      const selectedFavoriteUserIds = [...new Set(favoriteUserIds)];
      const currentFavoriteUserIds = new Set(
        this.favoriteUsers.map((favorite) => favorite.favoriteUserId),
      );

      const favoriteUserIdsToAdd = selectedFavoriteUserIds.filter(
        (favoriteUserId) => !currentFavoriteUserIds.has(favoriteUserId),
      );
      const favoriteIdsToDelete = this.favoriteUsers
        .filter(
          (favorite) =>
            !selectedFavoriteUserIds.includes(favorite.favoriteUserId),
        )
        .map((favorite) => favorite.favoriteId);

      await Promise.all([
        ...favoriteUserIdsToAdd.map((favoriteUserId) =>
          $api("/api/users/me/favorites", {
            method: "POST",
            body: {
              favoriteUserId,
            } satisfies AddUserFavoritesRequestDto,
          }),
        ),
        ...favoriteIdsToDelete.map((favoriteId) =>
          $api(`/api/users/me/favorites/${favoriteId}`, {
            method: "DELETE",
          }),
        ),
      ]);

      await this.fetchFavorites(true);
    },
  },
});
