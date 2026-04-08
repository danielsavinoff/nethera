<script setup lang="ts">
import * as locales from "@bitrix24/b24ui-nuxt/locale";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const route = useRoute();

watchEffect(async () => {
  if (route.path === "/install") {
    return;
  }

  await userStore.fetchCurrent();
});

const { locale, defaultLocale, setLocale, availableLocales } = useI18n();

const userLanguage = computed(() => user.value?.language);

const language = computed(() =>
  availableLocales.includes(userLanguage.value as any)
    ? userLanguage.value
    : (locales[locale.value]?.code ?? defaultLocale),
);
const direction = computed(() => locales[locale.value]?.dir || "ltr");

watch(
  language,
  (newLang) => {
    if (!newLang) return;
    setLocale(newLang as any);
  },
  { immediate: true },
);

useHead({
  htmlAttrs: { lang: language.value, dir: direction.value },
});
</script>

<template>
  <B24App :locale="locales[locale]">
    <NuxtLoadingIndicator
      color="var(--ui-color-design-filled-warning-bg)"
      :height="3"
    />
    <B24DashboardGroup class="min-h-dvh flex flex-col p-(--content-area-shift)">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </B24DashboardGroup>
  </B24App>
</template>
