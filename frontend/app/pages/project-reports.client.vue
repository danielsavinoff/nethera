<script setup lang="ts">
const { t } = useI18n();
const selectedWeekRange = ref({
  from: 12,
  to: 15,
});

useHead({
  title: `${t("page.index.navigation.projectReports")} | ${t("page.index.header.title")}`,
});
</script>

<template>
  <section class="flex flex-col gap-6">
    <ProjectReportsFiltersForm
      @update-week-range="selectedWeekRange = $event"
    />
    <ProjectReportsTable :selected-week-range="selectedWeekRange" />
  </section>
</template>
