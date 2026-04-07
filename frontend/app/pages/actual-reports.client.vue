<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: `${t('page.index.navigation.actualReports')} | ${t('page.index.header.title')}`,
})
</script>

<template>
  <ActualReportsFiltersForm />
</template>
