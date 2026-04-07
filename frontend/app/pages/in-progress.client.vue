<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: `${t('page.index.navigation.inProgress')} | ${t('page.index.header.title')}`,
})
</script>

<template>
  <ResourceFiltersForm />
</template>
