<script setup lang="ts">
import Market1Icon from "@bitrix24/b24icons-vue/main/Market1Icon";

const { t } = useI18n();

const columns = [
  t("page.inProgress.table.group"),
  t("page.inProgress.table.planFact"),
  t("page.inProgress.table.reserved"),
  t("page.inProgress.table.used"),
  t("page.inProgress.table.remaining"),
];

const formatTime = (hours: number, minutes: number, seconds: number) =>
  [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");

const parseTime = (value: string) => {
  const [hours, minutes, seconds] = value.split(":").map(Number);

  return hours! * 3600 + minutes! * 60 + seconds!;
};

const sumTimes = (values: string[]) => {
  const totalSeconds = values.reduce((sum, value) => sum + parseTime(value), 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return formatTime(hours, minutes, seconds);
};

const getTotals = (
  items: Array<{
    reserved: string;
    used: string;
    remaining: string;
  }>,
) => ({
  reserved: sumTimes(items.map((item) => item.reserved)),
  used: sumTimes(items.map((item) => item.used)),
  remaining: sumTimes(items.map((item) => item.remaining)),
});

const projects = [
  {
    id: "website-redesign",
    name: "Website Redesign",
    tasks: [
      {
        id: "discovery",
        name: "Discovery",
        planFact: `${formatTime(10, 0, 0)} / ${formatTime(8, 10, 0)}`,
        reserved: formatTime(2, 15, 0),
        used: formatTime(8, 10, 0),
        remaining: formatTime(1, 35, 0),
      },
      {
        id: "ui-kit",
        name: "UI Kit",
        planFact: `${formatTime(10, 30, 0)} / ${formatTime(7, 5, 0)}`,
        reserved: formatTime(1, 15, 0),
        used: formatTime(7, 5, 0),
        remaining: formatTime(2, 10, 0),
      },
      {
        id: "frontend-build",
        name: "Frontend Build",
        planFact: `${formatTime(15, 30, 0)} / ${formatTime(12, 0, 0)}`,
        reserved: formatTime(2, 45, 0),
        used: formatTime(12, 0, 0),
        remaining: formatTime(3, 50, 0),
      },
    ],
  },
  {
    id: "mobile-launch",
    name: "Mobile App Launch",
    tasks: [
      {
        id: "api-integration",
        name: "API Integration",
        planFact: `${formatTime(12, 0, 0)} / ${formatTime(9, 45, 0)}`,
        reserved: formatTime(2, 20, 0),
        used: formatTime(9, 45, 0),
        remaining: formatTime(2, 15, 0),
      },
      {
        id: "qa-pass",
        name: "QA Pass",
        planFact: `${formatTime(9, 30, 0)} / ${formatTime(7, 20, 0)}`,
        reserved: formatTime(1, 40, 0),
        used: formatTime(7, 20, 0),
        remaining: formatTime(2, 10, 0),
      },
      {
        id: "release-prep",
        name: "Release Prep",
        planFact: `${formatTime(14, 0, 0)} / ${formatTime(11, 30, 0)}`,
        reserved: formatTime(3, 10, 0),
        used: formatTime(11, 30, 0),
        remaining: formatTime(3, 20, 0),
      },
    ],
  },
];

const projectRows = computed(() =>
  projects.map((project) => ({
    ...project,
    totals: getTotals(project.tasks),
  })),
);

const totals = computed(() =>
  getTotals(projects.flatMap((project) => project.tasks)),
);

useHead({
  title: `${t("page.index.navigation.inProgress")} | ${t("page.index.header.title")}`,
});
</script>

<template>
  <section class="flex flex-col gap-6">
    <ResourceFiltersForm />

    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse text-sm">
        <thead>
          <tr
            class="border-b border-(--ui-color-design-outline-stroke) text-left"
          >
            <th
              v-for="column in columns"
              :key="column"
              class="px-4 py-3 font-medium text-(--ui-color-base-1)"
            >
              {{ column }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="project in projectRows" :key="project.id">
            <tr
              class="border-b border-(--ui-color-design-outline-stroke) bg-(--ui-color-background-secondary)/50 font-medium"
            >
              <td class="px-4 py-3 text-(--ui-color-base-1)">
                <div class="flex items-center gap-3">
                  <span
                    class="flex size-8 items-center justify-center rounded-full border border-(--ui-color-design-outline-stroke) bg-(--ui-color-background-primary)"
                  >
                    <Market1Icon class="size-4" />
                  </span>
                  <span>{{ project.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3"></td>
              <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
                {{ project.totals.reserved }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
                {{ project.totals.used }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
                {{ project.totals.remaining }}
              </td>
            </tr>
            <tr
              v-for="task in project.tasks"
              :key="task.id"
              class="border-b border-(--ui-color-design-outline-stroke) last:border-b-0"
            >
              <td class="px-4 py-3">
                <button
                  type="button"
                  class="cursor-pointer text-(--ui-color-link-primary-base,#2066b0)"
                >
                  {{ task.name }}
                </button>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
                {{ task.planFact }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
                {{ task.reserved }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
                {{ task.used }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
                {{ task.remaining }}
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr
            class="border-t border-(--ui-color-design-outline-stroke) font-medium"
          >
            <td colspan="2" class="px-4 py-3 text-(--ui-color-base-1)">
              {{ t("page.inProgress.table.total") }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ totals.reserved }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ totals.used }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ totals.remaining }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>
</template>
