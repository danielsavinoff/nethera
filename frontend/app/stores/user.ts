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
  }),

  actions: {
    async fetchCurrent() {
      const { $api } = useNuxtApp();

      this.user = await $api<CurrentUser>("/api/users/me");
      this.loaded = true;
    },

    async fetchUsers(active = true) {
      if (this.usersLoaded) {
        return;
      }

      const { $api } = useNuxtApp();

      const query: GetUsersQuery = {
        active,
        page: 1,
        limit: 1000,
      };
      const response = await $api<GetUsersResponseDto>("/api/users", {
        query,
      });

      this.users = response.users;
      this.usersLoaded = true;
    },
  },
});
