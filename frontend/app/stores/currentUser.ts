import { defineStore } from "pinia";
import type { components } from "~~/shared/types/generated/api";
import { TIME_ALLOCATION_ADD_ANY_PERMISSION } from "~~/app/constants/permissions";

export type CurrentUser = components["schemas"]["GetCurrentUserResponseDto"];

export const useCurrentUserStore = defineStore("currentUser", {
  state: () => ({
    user: null as CurrentUser | null,
    loaded: false,
  }),

  getters: {
    canAddTimeAllocationForAnyone: (state) =>
      Boolean(
        state.user?.permissions.includes(TIME_ALLOCATION_ADD_ANY_PERMISSION),
      ),
  },

  actions: {
    async fetchCurrent(force = false) {
      if (this.loaded && !force) {
        return;
      }

      const { $api } = useNuxtApp();

      this.user = await $api<CurrentUser>("/api/users/me");
      this.loaded = true;
    },
  },
});
