import { defineStore } from "pinia";
import type { components, operations } from "~~/shared/types/generated/api";

export type CurrentUser = components["schemas"]["GetCurrentUserResponseDto"];
export type UserListItem = components["schemas"]["GetUserResponseDto"];
type GetUsersResponseDto = components["schemas"]["GetUsersResponseDto"];
type GetUsersQuery =
  operations["UserController_handleGetUsers"]["parameters"]["query"];

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as CurrentUser | null,
    users: [] as UserListItem[],
    loaded: false,
    usersLoaded: false,
    usersLoading: false,
    usersLoadingMore: false,
    usersPage: 0,
    usersTotal: 0,
    usersLimit: 100,
    usersActiveFilter: true,
  }),

  getters: {
    hasMoreUsers: (state) => state.users.length < state.usersTotal,
  },

  actions: {
    async fetchCurrent() {
      const { $api } = useNuxtApp();

      this.user = await $api<CurrentUser>("/api/users/me");
      this.loaded = true;
    },

    resetUsers(active = true) {
      this.users = [];
      this.usersLoaded = false;
      this.usersLoading = false;
      this.usersLoadingMore = false;
      this.usersPage = 0;
      this.usersTotal = 0;
      this.usersActiveFilter = active;
    },

    async fetchUsers(active = true) {
      if (this.usersLoaded && this.usersActiveFilter === active) {
        return;
      }

      this.resetUsers(active);
      await this.loadMoreUsers(active);
    },

    async loadMoreUsers(active = this.usersActiveFilter) {
      if (this.usersActiveFilter !== active && this.usersPage > 0) {
        this.resetUsers(active);
      } else {
        this.usersActiveFilter = active;
      }

      if (this.usersLoading || this.usersLoadingMore) {
        return;
      }

      if (this.usersPage > 0 && !this.hasMoreUsers) {
        return;
      }

      const { $api } = useNuxtApp();
      const nextPage = this.usersPage + 1;
      const isInitialPage = nextPage === 1;

      if (isInitialPage) {
        this.usersLoading = true;
      } else {
        this.usersLoadingMore = true;
      }

      try {
        const query: GetUsersQuery = {
          active,
          page: nextPage,
          limit: this.usersLimit,
        };
        const response = await $api<GetUsersResponseDto>("/api/users", {
          query,
        });

        const loadedUserIds = new Set(this.users.map((user) => user.id));
        const nextUsers = response.users.filter(
          (user) => !loadedUserIds.has(user.id),
        );

        this.users = isInitialPage
          ? response.users
          : [...this.users, ...nextUsers];
        this.usersPage = response.page;
        this.usersTotal = response.total;
        this.usersLoaded = true;
      } finally {
        this.usersLoading = false;
        this.usersLoadingMore = false;
      }
    },
  },
});
