<script setup lang="ts">
import type { FormSubmitEvent } from "@bitrix24/b24ui-nuxt";
import { Icon } from "@iconify/vue";
import type {
  UserPickerBrowseState,
  UserPickerItem,
  UserPickerLoadState,
} from "~~/app/composables/useUserPickerPageState";

const query = defineModel<string>("query", {
  default: "",
});

const props = defineProps<{
  users: UserPickerItem[];
  searchState: UserPickerLoadState;
  browseState: UserPickerBrowseState;
  loadNextSearch: (query?: string) => Promise<void>;
  loadDepartmentUsers: (departmentExternalId: string) => Promise<void>;
  resetSearch: () => void;
}>();

const { t } = useI18n();
const emit = defineEmits<{
  updateWeekRange: [value: { from: number; to: number }];
}>();

const { years: yearItems, currentYear } = useYears();

const formState = reactive({
  user: [],
  year: [String(currentYear)],
  weekFrom: ["12"],
  weekTo: ["15"],
});

const selectedYear = computed(() => Number(formState.year[0] ?? String(currentYear)));

const { weeks: isoWeeks } = useIsoWeeks(selectedYear);

const weekItems = computed(() => isoWeeks.value.map(String));

const getWeekNumber = (value: string | undefined, fallback: number) =>
  Number(value ?? String(fallback));

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

const syncSelectedWeeks = () => {
  const firstWeek = isoWeeks.value[0] ?? 1;
  const lastWeek = isoWeeks.value.at(-1) ?? firstWeek;
  const clampWeek = (value: string | undefined, fallback: number) =>
    Math.min(Math.max(getWeekNumber(value, fallback), firstWeek), lastWeek);

  formState.weekFrom = [String(clampWeek(formState.weekFrom[0], 12))];
  formState.weekTo = [String(clampWeek(formState.weekTo[0], 15))];
};

watch(selectedYear, syncSelectedWeeks, { immediate: true });

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
  const firstWeek = isoWeeks.value[0] ?? 1;
  const lastWeek = isoWeeks.value.at(-1) ?? firstWeek;
  const from = getWeekNumber(formState.weekFrom[0], firstWeek);
  const to = getWeekNumber(formState.weekTo[0], lastWeek);

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

const RestartIcon = () =>
  h(Icon, {
    icon: "iconamoon:restart-fill",
    strokeWidth: 2,
  });
</script>

<template>
  <B24Form :state="formState" class="w-full" @submit="onSubmit">
    <section class="flex w-full flex-wrap items-end gap-4">
      <B24FormField
        name="user"
        :label="t('page.projectReports.filters.user.label')"
        :b24ui="{
          wrapper: 'mb-2',
        }"
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
          :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
          :placeholder="t('page.projectReports.filters.user.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="year"
        :label="t('page.projectReports.filters.year.label')"
        :b24ui="{
          wrapper: 'mb-2',
        }"
        class="min-w-[12rem] flex-1"
      >
        <SingleLineInputMenu
          v-model="formState.year"
          multiple
          open-on-focus
          autocomplete=""
          :items="yearItems"
          size="lg"
          :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
          :placeholder="t('page.projectReports.filters.year.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="weekFrom"
        :label="t('page.projectReports.filters.weekFrom.label')"
        :b24ui="{
          wrapper: 'mb-2',
        }"
        class="min-w-[14rem] flex-1"
      >
        <SingleLineInputMenu
          v-model="formState.weekFrom"
          multiple
          open-on-focus
          autocomplete=""
          :items="weekItems"
          size="lg"
          :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
          :placeholder="t('page.projectReports.filters.weekFrom.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="weekTo"
        :label="t('page.projectReports.filters.weekTo.label')"
        :b24ui="{
          wrapper: 'mb-2',
        }"
        class="min-w-[14rem] flex-1"
      >
        <SingleLineInputMenu
          v-model="formState.weekTo"
          multiple
          open-on-focus
          autocomplete=""
          :items="weekItems"
          size="lg"
          :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
          :placeholder="t('page.projectReports.filters.weekTo.placeholder')"
        />
      </B24FormField>

      <B24Button
        type="submit"
        color="air-secondary-no-accent"
        :icon="RestartIcon"
        class="[--ui-btn-border-color:var(--ui-color-base-5)]! border"
        :aria-label="t('page.projectReports.filters.submit')"
        :b24ui="{ leadingIcon: 'text-(--ui-color-base-1) rotate-135 size-5' }"
        size="lg"
      />
    </section>
  </B24Form>
</template>
