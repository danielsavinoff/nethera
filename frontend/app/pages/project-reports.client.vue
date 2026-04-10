<script setup lang="ts">
const userStore = useUserStore();

const { hasMoreUsers, users, usersLoadingMore } = storeToRefs(userStore);
const { t } = useI18n();

const selectedWeekRange = ref({
  from: 12,
  to: 15,
});

await userStore.fetchUsers();

const userItems = computed(() =>
  users.value.map((user) => ({
    id: user.id,
    label: user.displayName,
  })),
);

useHead({
  title: `${t("page.index.navigation.projectReports")} | ${t("page.index.header.title")}`,
});
</script>

<template>
  <section class="flex flex-col gap-6">
    <ProjectReportsFiltersForm
      :users="userItems"
      :has-more-users="hasMoreUsers"
      :is-loading-more-users="usersLoadingMore"
      @load-more-users="userStore.loadMoreUsers()"
      @update-week-range="selectedWeekRange = $event"
    />
    <ProjectReportsTable :selected-week-range="selectedWeekRange" />
  </section>
</template>
