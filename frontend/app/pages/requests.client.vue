<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: `${t('page.index.navigation.requests')} | ${t('page.index.header.title')}`,
})
</script>

<template>
  <ResourceFiltersForm />
</template>
