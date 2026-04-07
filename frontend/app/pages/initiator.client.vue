<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: `${t('page.index.navigation.initiator')} | ${t('page.index.header.title')}`,
})
</script>

<template>
  <ResourceFiltersForm />
</template>
