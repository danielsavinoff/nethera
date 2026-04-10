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

const yearItems = ref(["2024", "2025", "2026"]);
const weekItems = ref(["Week 12", "Week 13", "Week 14", "Week 15"]);

const formState = reactive({
  user: [],
  year: ["2026"],
  week: ["Week 14"],
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
  () => formState.week,
  (values) => {
    formState.week = keepLastSelection(values);
  },
);

const onSubmit = (_event: FormSubmitEvent<FilterFormState>) => {};
</script>

<template>
  <B24Form :state="formState" class="w-full" @submit="onSubmit">
    <section class="flex w-full flex-wrap items-end gap-4">
      <B24FormField
        name="user"
        :label="t('page.index.filters.user.label')"
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
          :placeholder="t('page.index.filters.user.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="year"
        :label="t('page.index.filters.year.label')"
        class="min-w-[12rem] flex-1"
      >
        <SingleLineInputMenu
          v-model="formState.year"
          multiple
          open-on-focus
          autocomplete=""
          :items="yearItems"
          size="lg"
          :placeholder="t('page.index.filters.year.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="week"
        :label="t('page.index.filters.week.label')"
        class="min-w-[14rem] flex-1"
      >
        <SingleLineInputMenu
          v-model="formState.week"
          multiple
          open-on-focus
          autocomplete=""
          :items="weekItems"
          size="lg"
          :placeholder="t('page.index.filters.week.placeholder')"
        />
      </B24FormField>

      <B24Button
        type="submit"
        color="air-secondary-no-accent"
        :icon="RefreshIcon"
        :aria-label="t('page.index.filters.submit')"
        size="lg"
      />
    </section>
  </B24Form>
</template>
