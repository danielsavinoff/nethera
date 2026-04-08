<script setup lang="ts">
const { t } = useI18n()
const selectedWeekLabel = ref(
  t('page.actualReports.table.weekLabel', { number: 15 }),
)

useHead({
  title: `${t('page.index.navigation.actualReports')} | ${t('page.index.header.title')}`,
})
</script>

<template>
  <section class="flex flex-col gap-6">
    <ActualReportsFiltersForm
      @update-selected-week-label="selectedWeekLabel = $event"
    />
    <ActualReportsTable :selected-week-label="selectedWeekLabel" />
  </section>
</template>
