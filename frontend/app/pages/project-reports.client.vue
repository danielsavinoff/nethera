<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: `${t('page.index.navigation.projectReports')} | ${t('page.index.header.title')}`,
})
</script>

<template>
  <ProjectReportsFiltersForm />
</template>
