<script setup lang="ts">
import { Plus30Icon } from "@bitrix24/b24icons-vue/actions";
import { MenuIcon } from "@bitrix24/b24icons-vue/main";
import Market1Icon from "@bitrix24/b24icons-vue/main/Market1Icon";
import { PlusMIcon } from "@bitrix24/b24icons-vue/outline";
import HamburgerMenuIcon from "@bitrix24/b24icons-vue/outline/HamburgerMenuIcon";
import { PlusIcon } from "@bitrix24/b24icons-vue/solid";

const { t } = useI18n();
const currentUserStore = useCurrentUserStore();

const columns = computed(() => [
  t("page.requests.table.group"),
  t("page.requests.table.planFact"),
  t("page.requests.table.initiator"),
  t("page.requests.table.reserved"),
  t("page.requests.table.approved"),
]);

const canAddTimeAllocationForAnyone = computed(
  () => currentUserStore.canAddTimeAllocationForAnyone,
);

const isAddTimeAllocationDialogOpen = ref(false);
const selectedTaskForDialog = ref("");

const openAddTimeAllocationDialog = (taskName = "") => {
  selectedTaskForDialog.value = taskName;
  isAddTimeAllocationDialogOpen.value = true;
};

const handleAddTimeAllocationDialogOpenChange = (open: boolean) => {
  isAddTimeAllocationDialogOpen.value = open;
};

const getTaskMenuItems = (taskName: string) => [
  {
    label: t("page.requests.actions.addTimeAllocation"),
    onClick: () => openAddTimeAllocationDialog(taskName),
  },
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
    <table
      class="min-w-full border-collapse text-base [&_tbody_td]:h-13 [&_tbody_td]:max-h-13 [&_tbody_td]:overflow-hidden [&_tbody_td]:whitespace-nowrap [&_tfoot_td]:h-13 [&_tfoot_td]:max-h-13 [&_tfoot_td]:overflow-hidden [&_tfoot_td]:whitespace-nowrap [&_thead_th]:overflow-hidden [&_thead_th]:whitespace-nowrap"
    >
      <thead>
        <tr
          class="h-14 border-b border-(--ui-color-design-outline-stroke) text-left"
        >
          <th
            v-for="column in columns"
            :key="column"
            class="px-4 align-middle font-medium text-(--ui-color-base-1)"
          >
            {{ column }}
          </th>
          <th
            class="px-4 align-middle text-right font-medium text-(--ui-color-base-1)"
          >
            <B24Button
              v-if="canAddTimeAllocationForAnyone"
              :icon="Plus30Icon"
              size="lg"
              color="air-secondary-accent"
              :aria-label="t('page.requests.actions.addTimeAllocation')"
              :b24ui="{ leadingIcon: 'text-(--ui-color-base-1)' }"
              @click="openAddTimeAllocationDialog()"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="project in projectRows" :key="project.id">
          <tr
            class="h-13 border-b border-(--ui-color-design-outline-stroke) bg-(--ui-color-background-secondary)/50 font-normal"
          >
            <td class="px-4 align-middle text-(--ui-color-base-1)">
              <div class="flex items-center gap-3">
                <span
                  class="flex size-8 items-center justify-center rounded-full border border-(--ui-color-design-outline-stroke) bg-(--ui-color-background-primary)"
                >
                  <Market1Icon class="size-4" />
                </span>
              </div>
            </td>
            <td class="px-4 align-middle"></td>
            <td class="px-4 align-middle"></td>
            <td
              class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
            >
              {{ project.totals.reserved }}
            </td>
            <td
              class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
            >
              {{ project.totals.approved }}
            </td>
            <td class="px-4 align-middle"></td>
          </tr>
          <tr
            v-for="task in project.tasks"
            :key="task.id"
            class="h-13 border-b border-(--ui-color-design-outline-stroke) last:border-b-0"
          >
            <td class="px-4 align-middle">
              <button
                type="button"
                class="cursor-pointer text-(--ui-color-link-primary-base,#2066b0)"
              >
                {{ task.name }}
              </button>
            </td>
            <td
              class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
            >
              {{ task.planFact }}
            </td>
            <td class="px-4 align-middle text-(--ui-color-base-1)">
              {{ task.initiator }}
            </td>
            <td
              class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
            >
              {{ task.reserved }}
            </td>
            <td
              class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
            >
              {{ task.approved }}
            </td>
            <td class="px-4 align-middle text-right">
              <B24DropdownMenu
                v-if="canAddTimeAllocationForAnyone"
                :items="getTaskMenuItems(task.name)"
              >
                <B24Button
                  size="lg"
                  color="air-secondary-accent"
                  :icon="MenuIcon"
                  :aria-label="t('page.requests.actions.openMenu')"
                />
              </B24DropdownMenu>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr class="h-13 border-t border-(--ui-color-design-outline-stroke)">
          <td colspan="4" class="px-4 align-middle text-(--ui-color-base-1)">
            {{ t("page.requests.table.total") }}
          </td>
          <td
            class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
          >
            {{ totals.reserved }}
          </td>
          <td
            class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
          >
            {{ totals.approved }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <AddTimeAllocationDialog
    :open="isAddTimeAllocationDialogOpen"
    :initial-task="selectedTaskForDialog"
    @update:open="handleAddTimeAllocationDialogOpenChange"
  />
</template>
