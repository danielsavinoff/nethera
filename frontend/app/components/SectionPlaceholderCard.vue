<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <B24Card class="p-6">
    <ProseP class="mb-0">
      {{ title }}
    </ProseP>
  </B24Card>
</template>
