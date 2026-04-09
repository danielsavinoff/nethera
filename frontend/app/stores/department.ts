import { defineStore } from "pinia";
import type { components } from "~~/shared/types/generated/api";

export type Department =
  components["schemas"]["GetDepartmentResponseDto"];
type GetDepartmentsResponseDto =
  components["schemas"]["GetDepartmentsResponseDto"];

export const useDepartmentStore = defineStore("department", {
  state: () => ({
    departments: [] as Department[],
    loaded: false,
  }),

  actions: {
    async fetchAll() {
      if (this.loaded) {
        return;
      }

      const { $api } = useNuxtApp();
      const response = await $api<GetDepartmentsResponseDto>(
        "/api/departments",
      );

      this.departments = response.departments;
      this.loaded = true;
    },
  },
});
