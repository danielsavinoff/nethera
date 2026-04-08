<script setup lang="ts">
const props = defineProps<{
  selectedWeekLabel: string;
}>();

const { t } = useI18n();

const formatTime = (hours: number, minutes = 0, seconds = 0) =>
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

const formatPercent = (value: number) => `${value}%`;

const projects = [
  {
    id: "website-redesign",
    name: "Website Redesign",
    href: "/project-reports?project=website-redesign",
    weekReserved: formatTime(16, 0, 0),
    weekFact: formatTime(13, 40, 0),
    totalReserved: formatTime(84, 0, 0),
    totalFact: formatTime(76, 30, 0),
    bookingExecution: 91,
    overallTrack: 32,
  },
  {
    id: "mobile-launch",
    name: "Mobile App Launch",
    href: "/project-reports?project=mobile-launch",
    weekReserved: formatTime(11, 30, 0),
    weekFact: formatTime(9, 20, 0),
    totalReserved: formatTime(63, 30, 0),
    totalFact: formatTime(54, 45, 0),
    bookingExecution: 86,
    overallTrack: 24,
  },
  {
    id: "analytics-revamp",
    name: "Analytics Revamp",
    href: "/project-reports?project=analytics-revamp",
    weekReserved: formatTime(14, 15, 0),
    weekFact: formatTime(12, 10, 0),
    totalReserved: formatTime(58, 15, 0),
    totalFact: formatTime(49, 35, 0),
    bookingExecution: 85,
    overallTrack: 22,
  },
  {
    id: "support-automation",
    name: "Support Automation",
    href: "/project-reports?project=support-automation",
    weekReserved: formatTime(8, 45, 0),
    weekFact: formatTime(7, 30, 0),
    totalReserved: formatTime(41, 0, 0),
    totalFact: formatTime(35, 50, 0),
    bookingExecution: 87,
    overallTrack: 18,
  },
];

const totals = computed(() => ({
  weekReserved: sumTimes(projects.map((project) => project.weekReserved)),
  weekFact: sumTimes(projects.map((project) => project.weekFact)),
  totalReserved: sumTimes(projects.map((project) => project.totalReserved)),
  totalFact: sumTimes(projects.map((project) => project.totalFact)),
  bookingExecution: formatPercent(
    projects.reduce((sum, project) => sum + project.bookingExecution, 0),
  ),
}));
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full border-collapse text-sm">
      <thead>
        <tr class="border-b border-(--ui-color-design-outline-stroke)">
          <th
            rowspan="2"
            class="px-4 py-3 text-left font-medium text-(--ui-color-base-1)"
          >
            {{ t("page.projectReports.table.project") }}
          </th>
          <th
            colspan="2"
            class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ props.selectedWeekLabel }}
          </th>
          <th
            colspan="3"
            class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ t("page.projectReports.table.totalGroup") }}
          </th>
          <th
            rowspan="2"
            class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ t("page.projectReports.table.overallTrackShare") }}
          </th>
        </tr>
        <tr class="border-b border-(--ui-color-design-outline-stroke)">
          <th
            class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ t("page.projectReports.table.reserved") }}
          </th>
          <th
            class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ t("page.projectReports.table.fact") }}
          </th>
          <th
            class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ t("page.projectReports.table.reserved") }}
          </th>
          <th
            class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ t("page.projectReports.table.fact") }}
          </th>
          <th
            class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ t("page.projectReports.table.bookingExecution") }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="project in projects"
          :key="project.id"
          class="border-b border-(--ui-color-design-outline-stroke)"
        >
          <td class="px-4 py-3">
            <NuxtLink
              :to="project.href"
              class="text-(--ui-color-link-primary-base,#2066b0) transition-opacity hover:opacity-80"
            >
              {{ project.name }}
            </NuxtLink>
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ project.weekReserved }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ project.weekFact }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ project.totalReserved }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ project.totalFact }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ formatPercent(project.bookingExecution) }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ formatPercent(project.overallTrack) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="border-t border-(--ui-color-design-outline-stroke)">
          <td class="px-4 py-3 text-(--ui-color-base-1)">
            {{ t("page.projectReports.table.total") }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.weekReserved }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.weekFact }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.totalReserved }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.totalFact }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.bookingExecution }}
          </td>
          <td class="px-4 py-3" />
        </tr>
      </tfoot>
    </table>
  </div>
</template>
