<script setup lang="ts">
const { t } = useI18n();
const {
  users,
  searchState,
  browseState,
  query,
  loadNextSearch,
  loadDepartmentUsers,
  resetSearch,
} = useUserPickerPageState();

const selectedWeekRange = ref({
  from: 12,
  to: 15,
});

await loadDepartmentUsers();

useHead({
  title: `${t("page.index.navigation.projectReports")} | ${t("page.index.header.title")}`,
});
</script>

<template>
  <section class="flex flex-col gap-6">
    <ProjectReportsFiltersForm
      v-model:query="query"
      :users="users"
      :search-state="searchState"
      :browse-state="browseState"
      :load-next-search="loadNextSearch"
      :load-department-users="loadDepartmentUsers"
      :reset-search="resetSearch"
      @update-week-range="selectedWeekRange = $event"
    />
    <ProjectReportsTable :selected-week-range="selectedWeekRange" />
  </section>
</template>
