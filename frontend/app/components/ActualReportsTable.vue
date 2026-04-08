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

const getPercent = (fact: string, base: string) => {
  const baseSeconds = parseTime(base);

  if (baseSeconds === 0) {
    return formatPercent(0);
  }

  const factSeconds = parseTime(fact);

  return formatPercent(Math.round((factSeconds / baseSeconds) * 100));
};

const normHours = ref(formatTime(40, 0, 0));

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
    label: t("page.actualReports.table.weekLabel", {
      number: weekNumber,
    }),
  })),
);

const users = [
  {
    id: "alex-johnson",
    name: "Alex Johnson",
    weeks: {
      12: {
        reserved: formatTime(22, 0, 0),
        bookingFact: formatTime(19, 40, 0),
        requestsTotal: formatTime(5, 20, 0),
      },
      13: {
        reserved: formatTime(23, 30, 0),
        bookingFact: formatTime(20, 55, 0),
        requestsTotal: formatTime(5, 45, 0),
      },
      14: {
        reserved: formatTime(24, 15, 0),
        bookingFact: formatTime(22, 10, 0),
        requestsTotal: formatTime(6, 15, 0),
      },
      15: {
        reserved: formatTime(24, 0, 0),
        bookingFact: formatTime(21, 30, 0),
        requestsTotal: formatTime(6, 0, 0),
      },
    },
  },
  {
    id: "maria-petrova",
    name: "Maria Petrova",
    weeks: {
      12: {
        reserved: formatTime(19, 0, 0),
        bookingFact: formatTime(17, 10, 0),
        requestsTotal: formatTime(7, 0, 0),
      },
      13: {
        reserved: formatTime(20, 30, 0),
        bookingFact: formatTime(18, 20, 0),
        requestsTotal: formatTime(7, 15, 0),
      },
      14: {
        reserved: formatTime(21, 0, 0),
        bookingFact: formatTime(19, 30, 0),
        requestsTotal: formatTime(7, 40, 0),
      },
      15: {
        reserved: formatTime(20, 0, 0),
        bookingFact: formatTime(18, 45, 0),
        requestsTotal: formatTime(7, 30, 0),
      },
    },
  },
  {
    id: "daniel-kim",
    name: "Daniel Kim",
    weeks: {
      12: {
        reserved: formatTime(15, 30, 0),
        bookingFact: formatTime(13, 10, 0),
        requestsTotal: formatTime(7, 30, 0),
      },
      13: {
        reserved: formatTime(16, 10, 0),
        bookingFact: formatTime(14, 0, 0),
        requestsTotal: formatTime(8, 0, 0),
      },
      14: {
        reserved: formatTime(16, 45, 0),
        bookingFact: formatTime(14, 50, 0),
        requestsTotal: formatTime(8, 20, 0),
      },
      15: {
        reserved: formatTime(16, 0, 0),
        bookingFact: formatTime(14, 20, 0),
        requestsTotal: formatTime(8, 10, 0),
      },
    },
  },
  {
    id: "anna-smirnova",
    name: "Anna Smirnova",
    weeks: {
      12: {
        reserved: formatTime(17, 30, 0),
        bookingFact: formatTime(15, 45, 0),
        requestsTotal: formatTime(5, 0, 0),
      },
      13: {
        reserved: formatTime(18, 0, 0),
        bookingFact: formatTime(16, 5, 0),
        requestsTotal: formatTime(5, 10, 0),
      },
      14: {
        reserved: formatTime(18, 45, 0),
        bookingFact: formatTime(16, 55, 0),
        requestsTotal: formatTime(5, 25, 0),
      },
      15: {
        reserved: formatTime(18, 30, 0),
        bookingFact: formatTime(16, 40, 0),
        requestsTotal: formatTime(5, 20, 0),
      },
    },
  },
];

const rows = computed(() =>
  users.map((user) => {
    return {
      ...user,
      weeks: selectedWeeks.value.map((weekNumber) => {
        const week = user.weeks[weekNumber as keyof typeof user.weeks];
        const totalFact = sumTimes([week.bookingFact, week.requestsTotal]);

        return {
          number: weekNumber,
          ...week,
          totalFact,
          bookingExecution: getPercent(week.bookingFact, week.reserved),
          normExecution: getPercent(totalFact, normHours.value),
        };
      }),
    };
  }),
);

const totals = computed(() => {
  return selectedWeeks.value.map((weekNumber) => {
    const reserved = sumTimes(
      users.map(
        (user) => user.weeks[weekNumber as keyof typeof user.weeks].reserved,
      ),
    );
    const bookingFact = sumTimes(
      users.map(
        (user) => user.weeks[weekNumber as keyof typeof user.weeks].bookingFact,
      ),
    );
    const requestsTotal = sumTimes(
      users.map(
        (user) =>
          user.weeks[weekNumber as keyof typeof user.weeks].requestsTotal,
      ),
    );
    const totalFact = sumTimes([bookingFact, requestsTotal]);
    const totalNorm = sumTimes(users.map(() => normHours.value));

    return {
      number: weekNumber,
      reserved,
      bookingFact,
      requestsTotal,
      totalFact,
      bookingExecution: getPercent(bookingFact, reserved),
      normExecution: getPercent(totalFact, totalNorm),
    };
  });
});
</script>

<template>
  <div class="max-w-full overflow-x-auto rounded-lg">
    <table class="min-w-max border-collapse text-sm">
      <thead>
        <tr class="border-b border-(--ui-color-design-outline-stroke)">
          <th
            rowspan="2"
            class="sticky left-0 z-10 bg-(--ui-color-background-primary) px-4 py-3 text-left font-medium text-(--ui-color-base-1)"
          >
            {{ t("page.actualReports.table.user") }}
          </th>
          <th
            v-for="week in weekLabels"
            :key="week.number"
            colspan="6"
            class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ week.label }}
          </th>
        </tr>
        <tr class="border-b border-(--ui-color-design-outline-stroke)">
          <template v-for="week in weekLabels" :key="`subhead-${week.number}`">
            <th
              class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
            >
              {{ t("page.actualReports.table.reserved") }}
            </th>
            <th
              class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
            >
              {{ t("page.actualReports.table.bookingFact") }}
            </th>
            <th
              class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
            >
              {{ t("page.actualReports.table.requestsTotal") }}
            </th>
            <th
              class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
            >
              {{ t("page.actualReports.table.bookingExecution") }}
            </th>
            <th
              class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
            >
              {{ t("page.actualReports.table.totalFact") }}
            </th>
            <th
              class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
            >
              {{ t("page.actualReports.table.normExecution") }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in rows"
          :key="user.id"
          class="border-b border-(--ui-color-design-outline-stroke)"
        >
          <td
            class="sticky left-0 bg-(--ui-color-background-primary) px-4 py-3 text-(--ui-color-base-1)"
          >
            {{ user.name }}
          </td>
          <template
            v-for="week in user.weeks"
            :key="`${user.id}-${week.number}`"
          >
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.reserved }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.bookingFact }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.requestsTotal }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.bookingExecution }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.totalFact }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.normExecution }}
            </td>
          </template>
        </tr>
      </tbody>
      <tfoot>
        <tr class="border-t border-(--ui-color-design-outline-stroke)">
          <td
            class="sticky left-0 bg-(--ui-color-background-primary) px-4 py-3 text-(--ui-color-base-1)"
          >
            {{ t("page.actualReports.table.total") }}
          </td>
          <template v-for="week in totals" :key="`total-${week.number}`">
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.reserved }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.bookingFact }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.requestsTotal }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.bookingExecution }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.totalFact }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
              {{ week.normExecution }}
            </td>
          </template>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
