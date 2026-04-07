<script setup lang="ts">
import { computed } from "vue";
import type { NavigationMenuItem } from "@bitrix24/b24ui-nuxt";

const { t } = useI18n();

const navigationItems = computed<NavigationMenuItem[]>(() => [
  {
    label: t("page.index.navigation.inProgress"),
    active: true,
  },
  {
    label: t("page.index.navigation.requests"),
  },
  {
    label: t("page.index.navigation.initiator"),
  },
  {
    label: t("page.index.navigation.projectReports"),
  },
  {
    label: t("page.index.navigation.actualReports"),
  },
  {
    label: t("page.index.navigation.settings"),
  },
]);
</script>

<template>
  <div class="min-h-dvh bg-(--ui-color-background-primary) px-4 py-6 sm:px-6">
    <div class="mx-auto flex w-full flex-col gap-6">
      <section class="flex flex-wrap items-center gap-x-8 gap-y-5">
        <div class="min-w-[16rem] flex-1">
          <h1
            class="mt-2 text-2xl font-semibold text-(--ui-color-base-1) sm:text-3xl"
          >
            {{ t("page.index.header.title") }}
          </h1>
        </div>
        <div class="min-w-0 flex-1 basis-[42rem]">
          <B24NavigationMenu
            :items="navigationItems"
            orientation="horizontal"
            class="w-full"
            :b24ui="{}"
          />
        </div>
      </section>
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>
