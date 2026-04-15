<script setup lang="ts">
import Market1Icon from "@bitrix24/b24icons-vue/main/Market1Icon";

defineProps<{
  columns: string[];
  projectRows: Array<{
    id: string;
    name: string;
    tasks: Array<{
      id: string;
      name: string;
      planFact: string;
      reserved: string;
      used: string;
      remaining: string;
    }>;
    totals: {
      reserved: string;
      used: string;
      remaining: string;
    };
  }>;
  totals: {
    reserved: string;
    used: string;
    remaining: string;
  };
}>();

const { t } = useI18n();
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
        </tr>
      </thead>
      <tbody>
        <template v-for="project in projectRows" :key="project.id">
          <tr
            class="h-13 border-b border-(--ui-color-design-outline-stroke) bg-(--ui-color-background-secondary)/50"
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
            <td class="px-4 align-middle" />
            <td
              class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
            >
              {{ project.totals.reserved }}
            </td>
            <td
              class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
            >
              {{ project.totals.used }}
            </td>
            <td
              class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
            >
              {{ project.totals.remaining }}
            </td>
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
            <td
              class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
            >
              {{ task.reserved }}
            </td>
            <td
              class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
            >
              {{ task.used }}
            </td>
            <td
              class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
            >
              {{ task.remaining }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr class="h-13 border-t border-(--ui-color-design-outline-stroke)">
          <td colspan="2" class="px-4 align-middle text-(--ui-color-base-1)">
            {{ t("page.inProgress.table.total") }}
          </td>
          <td
            class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
          >
            {{ totals.reserved }}
          </td>
          <td
            class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
          >
            {{ totals.used }}
          </td>
          <td
            class="px-4 align-middle whitespace-nowrap text-(--ui-color-base-1)"
          >
            {{ totals.remaining }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
