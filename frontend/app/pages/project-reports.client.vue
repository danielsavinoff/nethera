<script setup lang="ts">
const { t } = useI18n()
const selectedWeekLabel = ref(
  t('page.projectReports.table.weekLabel', { number: 15 }),
)

useHead({
  title: `${t('page.index.navigation.projectReports')} | ${t('page.index.header.title')}`,
})
</script>

<template>
  <section class="flex flex-col gap-6">
    <ProjectReportsFiltersForm
      @update-selected-week-label="selectedWeekLabel = $event"
    />
    <ProjectReportsTable :selected-week-label="selectedWeekLabel" />
  </section>
</template>
