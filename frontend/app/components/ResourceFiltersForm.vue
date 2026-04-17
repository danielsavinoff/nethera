<script setup lang="ts">
import type { FormSubmitEvent } from "@bitrix24/b24ui-nuxt";
import type {
  UserPickerBrowseState,
  UserPickerItem,
  UserPickerLoadState,
} from "~~/app/composables/useUserPickerPageState";
import { Icon } from "@iconify/vue";

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

const { years: yearItems, currentYear } = useYears();

const formState = reactive({
  user: [],
  year: [String(currentYear)],
  week: ["14"],
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

const syncSelectedWeek = () => {
  const firstWeek = isoWeeks.value[0] ?? 1;
  const lastWeek = isoWeeks.value.at(-1) ?? firstWeek;
  const weekNumber = Math.min(
    Math.max(getWeekNumber(formState.week[0], 14), firstWeek),
    lastWeek,
  );

  formState.week = [String(weekNumber)];
};

watch(selectedYear, syncSelectedWeek, { immediate: true });

watch(
  () => formState.week,
  (values) => {
    formState.week = keepLastSelection(values);
  },
);

const onSubmit = (_event: FormSubmitEvent<FilterFormState>) => {};

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
        :label="t('page.index.filters.user.label')"
        :b24ui="{
          wrapper: 'mb-2',
        }"
        class="min-w-[16rem] flex-1 text-base font-semibold"
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
          :placeholder="t('page.index.filters.user.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="year"
        :label="t('page.index.filters.year.label')"
        :b24ui="{
          wrapper: 'mb-2',
        }"
        class="min-w-[12rem] flex-1 text-base"
      >
        <SingleLineInputMenu
          v-model="formState.year"
          multiple
          open-on-focus
          autocomplete=""
          :items="yearItems"
          size="lg"
          :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
          :placeholder="t('page.index.filters.year.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="week"
        :label="t('page.index.filters.week.label')"
        :b24ui="{
          wrapper: 'mb-2',
        }"
        class="min-w-[14rem] flex-1 text-base"
      >
        <SingleLineInputMenu
          v-model="formState.week"
          multiple
          open-on-focus
          autocomplete=""
          :items="weekItems"
          size="lg"
          :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
          :placeholder="t('page.index.filters.week.placeholder')"
        />
      </B24FormField>

      <B24Button
        type="submit"
        color="air-secondary-accent"
        :icon="RestartIcon"
        :aria-label="t('page.index.filters.submit')"
        class="text-(--ui-color-base-1) [--ui-color-design-outline-stroke:var(--ui-color-base-5)]! border"
        :b24ui="{ leadingIcon: 'text-(--ui-color-base-1) rotate-135 size-5' }"
        size="lg"
      />
    </section>
  </B24Form>
</template>
