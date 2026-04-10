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

useHead({
  title: `${t("page.index.navigation.settings")} | ${t("page.index.header.title")}`,
});
</script>

<template>
  <SettingsFavoriteUsersForm
    v-model:query="query"
    :users="users"
    :search-state="searchState"
    :browse-state="browseState"
    :load-next-search="loadNextSearch"
    :load-department-users="loadDepartmentUsers"
    :reset-search="resetSearch"
  />
</template>
