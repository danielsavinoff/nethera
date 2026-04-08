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

const getPercent = (fact: string, base: string) => {
  const baseSeconds = parseTime(base);

  if (baseSeconds === 0) {
    return formatPercent(0);
  }

  const factSeconds = parseTime(fact);

  return formatPercent(Math.round((factSeconds / baseSeconds) * 100));
};

const normHours = ref(formatTime(40, 0, 0));

const users = [
  {
    id: "alex-johnson",
    name: "Alex Johnson",
    reserved: formatTime(24, 0, 0),
    bookingFact: formatTime(21, 30, 0),
    requestsTotal: formatTime(6, 0, 0),
  },
  {
    id: "maria-petrova",
    name: "Maria Petrova",
    reserved: formatTime(20, 0, 0),
    bookingFact: formatTime(18, 45, 0),
    requestsTotal: formatTime(7, 30, 0),
  },
  {
    id: "daniel-kim",
    name: "Daniel Kim",
    reserved: formatTime(16, 0, 0),
    bookingFact: formatTime(14, 20, 0),
    requestsTotal: formatTime(8, 10, 0),
  },
  {
    id: "anna-smirnova",
    name: "Anna Smirnova",
    reserved: formatTime(18, 30, 0),
    bookingFact: formatTime(16, 40, 0),
    requestsTotal: formatTime(5, 20, 0),
  },
];

const rows = computed(() =>
  users.map((user) => {
    const totalFact = sumTimes([user.bookingFact, user.requestsTotal]);

    return {
      ...user,
      totalFact,
      bookingExecution: getPercent(user.bookingFact, user.reserved),
      normExecution: getPercent(totalFact, normHours.value),
    };
  }),
);

const totals = computed(() => {
  const reserved = sumTimes(users.map((user) => user.reserved));
  const bookingFact = sumTimes(users.map((user) => user.bookingFact));
  const requestsTotal = sumTimes(users.map((user) => user.requestsTotal));
  const totalFact = sumTimes(rows.value.map((row) => row.totalFact));
  const totalNorm = sumTimes(rows.value.map(() => normHours.value));

  return {
    reserved,
    bookingFact,
    requestsTotal,
    totalFact,
    bookingExecution: getPercent(bookingFact, reserved),
    normExecution: getPercent(totalFact, totalNorm),
  };
});
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
            {{ t("page.actualReports.table.user") }}
          </th>
          <th
            colspan="6"
            class="px-4 py-3 text-left font-medium text-(--ui-color-base-1) border-l border-(--ui-color-design-outline-stroke)"
          >
            {{ props.selectedWeekLabel }}
          </th>
        </tr>
        <tr class="border-b border-(--ui-color-design-outline-stroke)">
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
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in rows"
          :key="user.id"
          class="border-b border-(--ui-color-design-outline-stroke)"
        >
          <td class="px-4 py-3 text-(--ui-color-base-1)">
            {{ user.name }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ user.reserved }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ user.bookingFact }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ user.requestsTotal }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ user.bookingExecution }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ user.totalFact }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ user.normExecution }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="border-t border-(--ui-color-design-outline-stroke)">
          <td class="px-4 py-3 text-(--ui-color-base-1)">
            {{ t("page.actualReports.table.total") }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.reserved }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.bookingFact }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.requestsTotal }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.bookingExecution }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.totalFact }}
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-(--ui-color-base-1)">
            {{ totals.normExecution }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
