<script setup lang="ts">
const userStore = useUserStore();
const { hasMoreUsers, users, usersLoadingMore } = storeToRefs(userStore);

const { t } = useI18n();

await userStore.fetchUsers();

const userItems = computed(() =>
  users.value.map((user) => ({
    id: user.id,
    label: user.displayName,
  })),
);

useHead({
  title: `${t("page.index.navigation.requests")} | ${t("page.index.header.title")}`,
});
</script>

<template>
  <section class="flex flex-col gap-6">
    <ResourceFiltersForm
      :users="userItems"
      :has-more-users="hasMoreUsers"
      :is-loading-more-users="usersLoadingMore"
      @load-more-users="userStore.loadMoreUsers()"
    />
    <RequestsProjectsTable />
  </section>
</template>
