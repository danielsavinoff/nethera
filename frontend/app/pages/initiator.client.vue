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

await loadDepartmentUsers();

useHead({
  title: `${t("page.index.navigation.initiator")} | ${t("page.index.header.title")}`,
});
</script>

<template>
  <section class="flex flex-col gap-6">
    <ResourceFiltersForm
      v-model:query="query"
      :users="users"
      :search-state="searchState"
      :browse-state="browseState"
      :load-next-search="loadNextSearch"
      :load-department-users="loadDepartmentUsers"
      :reset-search="resetSearch"
    />
    <RequestsProjectsTable />
  </section>
</template>
