<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: `${t('page.index.navigation.settings')} | ${t('page.index.header.title')}`,
})
</script>

<template>
  <SectionPlaceholderCard :title="t('page.index.navigation.settings')" />
</template>
