<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  b24ui?: Record<string, string>;
}>();

const singleLineInputMenuUi = {
  root: "w-full min-w-0",
  base: "flex min-w-0 flex-nowrap items-center overflow-hidden",
  tagsInput: "min-w-0 flex-1",
  leading: "shrink-0",
  trailing: "shrink-0",
};

const mergedB24ui = computed(() => ({
  ...singleLineInputMenuUi,
  ...props.b24ui,
}));
</script>

<template>
  <B24InputMenu v-bind="$attrs" :b24ui="mergedB24ui" />
</template>
