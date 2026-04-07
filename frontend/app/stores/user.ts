import { defineStore } from "pinia";
import type { components } from "~~/shared/types/generated/api";

export type User = components["schemas"]["GetCurrentUserResponseDto"];

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    loaded: false,
  }),

  actions: {
    async fetchCurrent() {
      const { $api } = useNuxtApp();

      this.user = await $api<User>("/api/users/me");
      this.loaded = true;
    },
  },
});
