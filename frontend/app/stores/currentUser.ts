import { defineStore } from "pinia";
import type { components } from "~~/shared/types/generated/api";

export type CurrentUser = components["schemas"]["GetCurrentUserResponseDto"];

export const useCurrentUserStore = defineStore("currentUser", {
  state: () => ({
    user: null as CurrentUser | null,
    loaded: false,
  }),

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
