<script setup lang="ts">
import { computed } from "vue";
import type { NavigationMenuItem } from "@bitrix24/b24ui-nuxt";

const { t } = useI18n();
const route = useRoute();

const navigationItems = computed<NavigationMenuItem[]>(() => [
  {
    label: t("page.index.navigation.inProgress"),
    type: "link",
    to: "/in-progress",
    exact: true,
    active: route.path === "/in-progress",
  },
  {
    label: t("page.index.navigation.requests"),
    type: "link",
    to: "/requests",
    exact: true,
    active: route.path === "/requests",
  },
  {
    label: t("page.index.navigation.initiator"),
    type: "link",
    to: "/initiator",
    exact: true,
    active: route.path === "/initiator",
  },
  {
    label: t("page.index.navigation.projectReports"),
    type: "link",
    to: "/project-reports",
    exact: true,
    active: route.path === "/project-reports",
  },
  {
    label: t("page.index.navigation.actualReports"),
    type: "link",
    to: "/actual-reports",
    exact: true,
    active: route.path === "/actual-reports",
  },
  {
    label: t("page.index.navigation.settings"),
    type: "link",
    to: "/settings",
    exact: true,
    active: route.path === "/settings",
  },
]);
</script>

<template>
  <div
    class="min-h-dvh bg-(--ui-color-background-primary) px-4 py-6 sm:px-6 rounded-xl"
  >
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
            :aria-label="t('page.index.header.title')"
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
