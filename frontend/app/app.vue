<script setup lang="ts">
import * as locales from "@bitrix24/b24ui-nuxt/locale";

const currentUserStore = useCurrentUserStore();
const departmentStore = useDepartmentStore();
const { user } = storeToRefs(currentUserStore);

const route = useRoute();

watchEffect(async () => {
  if (route.path === "/install") {
    return;
  }

  await currentUserStore.fetchCurrent();
  await departmentStore.fetchAll();
});

const { locale, defaultLocale, setLocale, availableLocales } = useI18n();

const b24Language = ref<string | undefined>();

try {
  const { $initializeB24Frame } = useNuxtApp();

  const $b24 = await $initializeB24Frame();

  b24Language.value = $b24.getLang();
} catch {}

const userLanguage = computed<string | undefined>(() => user.value?.language);

const language = computed(() => {
  if (
    userLanguage.value &&
    availableLocales.includes(userLanguage.value as any)
  ) {
    return userLanguage.value;
  }

  if (
    b24Language.value &&
    availableLocales.includes(b24Language.value as any)
  ) {
    return b24Language.value;
  }

  return locales[locale.value]?.code ?? String(defaultLocale);
});
const direction = computed(() => locales[locale.value]?.dir || "ltr");

watch(
  language,
  (newLang) => {
    if (!newLang) return;
    void setLocale(newLang as any);
  },
  { immediate: true },
);

useHead(() => ({
  htmlAttrs: { lang: language.value, dir: direction.value },
}));
</script>

<template>
  <B24App :locale="locales[locale]" class="">
    <NuxtLoadingIndicator
      color="var(--ui-color-design-filled-warning-bg)"
      :height="3"
    />
    <B24DashboardGroup class="min-h-dvh flex flex-col">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </B24DashboardGroup>
  </B24App>
</template>
