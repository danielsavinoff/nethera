<script setup lang="ts">
import type { FormSubmitEvent } from "@bitrix24/b24ui-nuxt";
import RefreshIcon from "@bitrix24/b24icons-vue/outline/RefreshIcon";
import type {
  UserPickerItem,
  UserPickerLoadState,
} from "~~/app/composables/useUserPickerPageState";

const query = defineModel<string>("query", {
  default: "",
});

const props = defineProps<{
  users: UserPickerItem[];
  searchState: UserPickerLoadState;
  browseState: UserPickerLoadState;
  loadNextSearch: (query?: string) => Promise<void>;
  loadDepartmentUsers: () => Promise<void>;
  resetSearch: () => void;
}>();

const { t } = useI18n();
const emit = defineEmits<{
  updateWeekRange: [value: { from: number; to: number }];
}>();

const yearItems = ref(["2024", "2025", "2026"]);

const weekNumbers = [12, 13, 14, 15];

const getWeekLabel = (value: string) => {
  const number = value.match(/\d+/)?.[0];

  return t("page.projectReports.table.weekLabel", {
    number: number ?? value,
  });
};

const weekItems = computed(() =>
  weekNumbers.map((weekNumber) =>
    t("page.projectReports.table.weekLabel", { number: weekNumber }),
  ),
);

const getWeekNumber = (value: string) =>
  Number(value.match(/\d+/)?.[0] ?? "15");

const formState = reactive({
  user: [],
  year: ["2026"],
  weekFrom: [getWeekLabel("12")],
  weekTo: [getWeekLabel("15")],
});

type FilterFormState = typeof formState;

const keepLastSelection = (values: string[]) => {
  if (values.length > 1) {
    return values.slice(-1);
  }

  return values;
};

watch(
  () => formState.user,
  (_values) => {
    // formState.user = keepLastSelection(values);
  },
);

watch(
  () => formState.year,
  (values) => {
    formState.year = keepLastSelection(values);
  },
);

watch(
  () => formState.weekFrom,
  (values) => {
    formState.weekFrom = keepLastSelection(values);
  },
);

watch(
  () => formState.weekTo,
  (values) => {
    formState.weekTo = keepLastSelection(values);
  },
);

const onSubmit = (_event: FormSubmitEvent<FilterFormState>) => {};

const selectedWeekRange = computed(() => {
  const from = getWeekNumber(formState.weekFrom[0] ?? "12");
  const to = getWeekNumber(formState.weekTo[0] ?? "15");

  return {
    from: Math.min(from, to),
    to: Math.max(from, to),
  };
});

watch(
  selectedWeekRange,
  (value) => {
    emit("updateWeekRange", value);
  },
  { immediate: true },
);
</script>

<template>
  <B24Form :state="formState" class="w-full" @submit="onSubmit">
    <section class="flex w-full flex-wrap items-end gap-4">
      <B24FormField
        name="user"
        :label="t('page.projectReports.filters.user.label')"
        class="min-w-[16rem] flex-1"
      >
        <UserLineInputMenu
          v-model="formState.user"
          v-model:search-term="query"
          multiple
          open-on-focus
          autocomplete=""
          :items="props.users"
          :search-state="props.searchState"
          :browse-state="props.browseState"
          :load-next-search="props.loadNextSearch"
          :load-department-users="props.loadDepartmentUsers"
          :reset-search="props.resetSearch"
          value-key="id"
          label-key="label"
          size="lg"
          :placeholder="t('page.projectReports.filters.user.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="year"
        :label="t('page.projectReports.filters.year.label')"
        class="min-w-[12rem] flex-1"
      >
        <SingleLineInputMenu
          v-model="formState.year"
          multiple
          open-on-focus
          autocomplete=""
          :items="yearItems"
          size="lg"
          :placeholder="t('page.projectReports.filters.year.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="weekFrom"
        :label="t('page.projectReports.filters.weekFrom.label')"
        class="min-w-[14rem] flex-1"
      >
        <SingleLineInputMenu
          v-model="formState.weekFrom"
          multiple
          open-on-focus
          autocomplete=""
          :items="weekItems"
          size="lg"
          :placeholder="t('page.projectReports.filters.weekFrom.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="weekTo"
        :label="t('page.projectReports.filters.weekTo.label')"
        class="min-w-[14rem] flex-1"
      >
        <SingleLineInputMenu
          v-model="formState.weekTo"
          multiple
          open-on-focus
          autocomplete=""
          :items="weekItems"
          size="lg"
          :placeholder="t('page.projectReports.filters.weekTo.placeholder')"
        />
      </B24FormField>

      <B24Button
        type="submit"
        color="air-secondary-no-accent"
        :icon="RefreshIcon"
        :aria-label="t('page.projectReports.filters.submit')"
        size="lg"
      />
    </section>
  </B24Form>
</template>
