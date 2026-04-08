<script setup lang="ts">
import Market1Icon from "@bitrix24/b24icons-vue/main/Market1Icon";

const { t } = useI18n();

const columns = [
  t("page.requests.table.group"),
  t("page.requests.table.planFact"),
  t("page.requests.table.initiator"),
  t("page.requests.table.reserved"),
  t("page.requests.table.approved"),
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
    approved: string;
  }>,
) => ({
  reserved: sumTimes(items.map((item) => item.reserved)),
  approved: sumTimes(items.map((item) => item.approved)),
});

const projects = [
  {
    id: "website-redesign",
    name: "Website Redesign",
    tasks: [
      {
        id: "copy-review",
        name: "Copy Review",
        planFact: `${formatTime(6, 0, 0)} / ${formatTime(4, 30, 0)}`,
        initiator: "Anna Smirnova",
        reserved: formatTime(2, 0, 0),
        approved: formatTime(1, 30, 0),
      },
      {
        id: "hero-redesign",
        name: "Hero Redesign",
        planFact: `${formatTime(8, 30, 0)} / ${formatTime(6, 45, 0)}`,
        initiator: "Ivan Petrov",
        reserved: formatTime(3, 15, 0),
        approved: formatTime(2, 40, 0),
      },
      {
        id: "asset-export",
        name: "Asset Export",
        planFact: `${formatTime(5, 0, 0)} / ${formatTime(3, 50, 0)}`,
        initiator: "Anna Smirnova",
        reserved: formatTime(1, 20, 0),
        approved: formatTime(1, 10, 0),
      },
    ],
  },
  {
    id: "mobile-launch",
    name: "Mobile App Launch",
    tasks: [
      {
        id: "sdk-update",
        name: "SDK Update",
        planFact: `${formatTime(7, 30, 0)} / ${formatTime(5, 20, 0)}`,
        initiator: "Maria Petrova",
        reserved: formatTime(2, 10, 0),
        approved: formatTime(1, 45, 0),
      },
      {
        id: "store-assets",
        name: "Store Assets",
        planFact: `${formatTime(4, 30, 0)} / ${formatTime(3, 0, 0)}`,
        initiator: "Daniel Kim",
        reserved: formatTime(1, 30, 0),
        approved: formatTime(1, 0, 0),
      },
      {
        id: "release-checklist",
        name: "Release Checklist",
        planFact: `${formatTime(6, 45, 0)} / ${formatTime(4, 55, 0)}`,
        initiator: "Maria Petrova",
        reserved: formatTime(2, 5, 0),
        approved: formatTime(1, 35, 0),
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
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full border-collapse text-sm">
      <thead>
        <tr class="border-b border-(--ui-color-design-outline-stroke) text-left">
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
            class="border-b border-(--ui-color-design-outline-stroke) bg-(--ui-color-background-secondary)/50 font-normal"
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
            <td class="px-4 py-3"></td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ project.totals.reserved }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ project.totals.approved }}
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
            <td class="px-4 py-3 text-(--ui-color-base-1)">
              {{ task.initiator }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ task.reserved }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ task.approved }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr class="border-t border-(--ui-color-design-outline-stroke)">
          <td colspan="3" class="px-4 py-3 text-(--ui-color-base-1)">
            {{ t("page.requests.table.total") }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.reserved }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.approved }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
