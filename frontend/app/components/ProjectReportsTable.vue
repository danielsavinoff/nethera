<script setup lang="ts">
const props = defineProps<{
  selectedWeekRange: {
    from: number;
    to: number;
  };
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

const getExecutionPercent = (fact: string, reserved: string) => {
  const reservedSeconds = parseTime(reserved);

  if (reservedSeconds === 0) {
    return formatPercent(0);
  }

  const factSeconds = parseTime(fact);

  return formatPercent(Math.round((factSeconds / reservedSeconds) * 100));
};

const selectedWeeks = computed(() => {
  const start = Math.min(
    props.selectedWeekRange.from,
    props.selectedWeekRange.to,
  );
  const end = Math.max(
    props.selectedWeekRange.from,
    props.selectedWeekRange.to,
  );

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
});

const weekLabels = computed(() =>
  selectedWeeks.value.map((weekNumber) => ({
    number: weekNumber,
    label: t("page.projectReports.table.weekLabel", {
      number: weekNumber,
    }),
  })),
);

const projects = [
  {
    id: "website-redesign",
    name: "Website Redesign",
    href: "/project-reports?project=website-redesign",
    weeks: {
      12: {
        reserved: formatTime(18, 0, 0),
        fact: formatTime(16, 25, 0),
      },
      13: {
        reserved: formatTime(19, 30, 0),
        fact: formatTime(17, 15, 0),
      },
      14: {
        reserved: formatTime(16, 30, 0),
        fact: formatTime(15, 10, 0),
      },
      15: {
        reserved: formatTime(16, 0, 0),
        fact: formatTime(13, 40, 0),
      },
    },
  },
  {
    id: "mobile-launch",
    name: "Mobile App Launch",
    href: "/project-reports?project=mobile-launch",
    weeks: {
      12: {
        reserved: formatTime(15, 0, 0),
        fact: formatTime(12, 35, 0),
      },
      13: {
        reserved: formatTime(14, 45, 0),
        fact: formatTime(13, 5, 0),
      },
      14: {
        reserved: formatTime(12, 15, 0),
        fact: formatTime(10, 40, 0),
      },
      15: {
        reserved: formatTime(11, 30, 0),
        fact: formatTime(9, 20, 0),
      },
    },
  },
  {
    id: "analytics-revamp",
    name: "Analytics Revamp",
    href: "/project-reports?project=analytics-revamp",
    weeks: {
      12: {
        reserved: formatTime(13, 0, 0),
        fact: formatTime(11, 15, 0),
      },
      13: {
        reserved: formatTime(15, 15, 0),
        fact: formatTime(12, 55, 0),
      },
      14: {
        reserved: formatTime(15, 45, 0),
        fact: formatTime(13, 15, 0),
      },
      15: {
        reserved: formatTime(14, 15, 0),
        fact: formatTime(12, 10, 0),
      },
    },
  },
  {
    id: "support-automation",
    name: "Support Automation",
    href: "/project-reports?project=support-automation",
    weeks: {
      12: {
        reserved: formatTime(9, 45, 0),
        fact: formatTime(8, 20, 0),
      },
      13: {
        reserved: formatTime(10, 15, 0),
        fact: formatTime(8, 45, 0),
      },
      14: {
        reserved: formatTime(12, 15, 0),
        fact: formatTime(11, 15, 0),
      },
      15: {
        reserved: formatTime(8, 45, 0),
        fact: formatTime(7, 30, 0),
      },
    },
  },
];

const projectRows = computed(() => {
  const rows = projects.map((project) => {
    const weeks = selectedWeeks.value.map((weekNumber) => ({
      number: weekNumber,
      reserved:
        project.weeks[weekNumber as keyof typeof project.weeks].reserved,
      fact: project.weeks[weekNumber as keyof typeof project.weeks].fact,
    }));
    const totalReserved = sumTimes(weeks.map((week) => week.reserved));
    const totalFact = sumTimes(weeks.map((week) => week.fact));

    return {
      ...project,
      weeks,
      totalReserved,
      totalFact,
      bookingExecution: getExecutionPercent(totalFact, totalReserved),
    };
  });

  const allFact = sumTimes(rows.map((row) => row.totalFact));

  return rows.map((row) => ({
    ...row,
    overallTrack: getExecutionPercent(row.totalFact, allFact),
  }));
});

const totals = computed(() => {
  const weeks = selectedWeeks.value.map((weekNumber) => ({
    number: weekNumber,
    reserved: sumTimes(
      projects.map(
        (project) =>
          project.weeks[weekNumber as keyof typeof project.weeks].reserved,
      ),
    ),
    fact: sumTimes(
      projects.map(
        (project) =>
          project.weeks[weekNumber as keyof typeof project.weeks].fact,
      ),
    ),
  }));
  const totalReserved = sumTimes(weeks.map((week) => week.reserved));
  const totalFact = sumTimes(weeks.map((week) => week.fact));

  return {
    weeks,
    totalReserved,
    totalFact,
    bookingExecution: getExecutionPercent(totalFact, totalReserved),
  };
});
</script>

<template>
  <div class="max-w-full overflow-x-auto rounded-lg">
    <table
      class="min-w-max border-collapse text-base [&_tbody_td]:h-13 [&_tbody_td]:max-h-13 [&_tbody_td]:overflow-hidden [&_tbody_td]:whitespace-nowrap [&_tfoot_td]:h-13 [&_tfoot_td]:max-h-13 [&_tfoot_td]:overflow-hidden [&_tfoot_td]:whitespace-nowrap [&_thead_th]:overflow-hidden [&_thead_th]:whitespace-nowrap"
    >
      <thead>
        <tr class="h-14 border-b border-(--ui-color-design-outline-stroke)">
          <th
            rowspan="2"
            class="sticky left-0 z-10 bg-(--ui-color-background-primary) px-4 align-middle text-left font-medium text-(--ui-color-base-1)"
          >
            {{ t("page.projectReports.table.project") }}
          </th>
          <th
            v-for="week in weekLabels"
            :key="week.number"
            colspan="2"
            class="px-4 align-middle text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ week.label }}
          </th>
          <th
            colspan="3"
            class="px-4 align-middle text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ t("page.projectReports.table.totalGroup") }}
          </th>
          <th
            rowspan="2"
            class="px-4 align-middle text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ t("page.projectReports.table.overallTrackShare") }}
          </th>
        </tr>
        <tr class="h-14 border-b border-(--ui-color-design-outline-stroke)">
          <template v-for="week in weekLabels" :key="`subhead-${week.number}`">
            <th
              class="px-4 align-middle text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
            >
              {{ t("page.projectReports.table.reserved") }}
            </th>
            <th
              class="px-4 align-middle text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
            >
              {{ t("page.projectReports.table.fact") }}
            </th>
          </template>
          <th
            class="px-4 align-middle text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ t("page.projectReports.table.reserved") }}
          </th>
          <th
            class="px-4 align-middle text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ t("page.projectReports.table.fact") }}
          </th>
          <th
            class="px-4 align-middle text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ t("page.projectReports.table.bookingExecution") }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="project in projectRows"
          :key="project.id"
          class="h-13 border-b border-(--ui-color-design-outline-stroke)"
        >
          <td
            class="sticky left-0 bg-(--ui-color-background-primary) px-4 align-middle"
          >
            <NuxtLink
              :to="project.href"
              class="text-(--ui-color-link-primary-base,#2066b0) transition-opacity hover:opacity-80"
            >
              {{ project.name }}
            </NuxtLink>
          </td>
          <template
            v-for="week in project.weeks"
            :key="`${project.id}-${week.number}`"
          >
            <td class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.reserved }}
            </td>
            <td class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.fact }}
            </td>
          </template>
          <td class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)">
            {{ project.totalReserved }}
          </td>
          <td class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)">
            {{ project.totalFact }}
          </td>
          <td class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)">
            {{ project.bookingExecution }}
          </td>
          <td class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)">
            {{ project.overallTrack }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="h-13 border-t border-(--ui-color-design-outline-stroke)">
          <td
            class="sticky left-0 bg-(--ui-color-background-primary) px-4 align-middle text-(--ui-color-base-1)"
          >
            {{ t("page.projectReports.table.total") }}
          </td>
          <template v-for="week in totals.weeks" :key="`total-${week.number}`">
            <td class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.reserved }}
            </td>
            <td class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.fact }}
            </td>
          </template>
          <td class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.totalReserved }}
          </td>
          <td class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.totalFact }}
          </td>
          <td class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.bookingExecution }}
          </td>
          <td class="px-4 align-middle" />
        </tr>
      </tfoot>
    </table>
  </div>
</template>
