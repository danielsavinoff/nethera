<script setup lang="ts">
const userStore = useUserStore();

const { users } = storeToRefs(userStore);
const { t } = useI18n();

const selectedWeekRange = ref({
  from: 12,
  to: 15,
});

await userStore.fetchUsers();

const userItems = computed(() => users.value.map((user) => user.displayName));

useHead({
  title: `${t("page.index.navigation.projectReports")} | ${t("page.index.header.title")}`,
});
</script>

<template>
  <section class="flex flex-col gap-6">
    <ProjectReportsFiltersForm
      :users="userItems"
      @update-week-range="selectedWeekRange = $event"
    />
    <ProjectReportsTable :selected-week-range="selectedWeekRange" />
  </section>
</template>
