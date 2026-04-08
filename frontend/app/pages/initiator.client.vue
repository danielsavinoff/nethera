<script setup lang="ts">
const userStore = useUserStore();
const { users } = storeToRefs(userStore);

const { t } = useI18n();

await userStore.fetchUsers();

const userItems = computed(() => users.value.map((user) => user.displayName));

useHead({
  title: `${t("page.index.navigation.initiator")} | ${t("page.index.header.title")}`,
});
</script>

<template>
  <section class="flex flex-col gap-6">
    <ResourceFiltersForm :users="userItems" />
    <RequestsProjectsTable />
  </section>
</template>
