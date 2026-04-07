<script setup lang="ts">
import type { FormSubmitEvent } from "@bitrix24/b24ui-nuxt";
import RefreshIcon from "@bitrix24/b24icons-vue/outline/RefreshIcon";

const { t } = useI18n();

const departmentItems = ref(["Engineering", "Operations", "Design", "HR"]);
const yearItems = ref(["2024", "2025", "2026"]);
const weekItems = ref(["Week 12", "Week 13", "Week 14", "Week 15"]);

const formState = reactive({
  department: ["Engineering"],
  year: ["2026"],
  weekFrom: ["Week 12"],
  weekTo: ["Week 15"],
  onlyFree: false,
});

type FilterFormState = typeof formState;

const keepLastSelection = (values: string[]) => {
  if (values.length > 1) {
    return values.slice(-1);
  }

  return values;
};

watch(
  () => formState.department,
  (values) => {
    formState.department = keepLastSelection(values);
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
</script>

<template>
  <B24Form :state="formState" class="w-full" @submit="onSubmit">
    <section class="flex w-full flex-wrap items-end gap-4">
      <B24FormField
        name="department"
        :label="t('page.actualReports.filters.department.label')"
        class="min-w-[16rem] flex-1"
      >
        <SingleLineInputMenu
          v-model="formState.department"
          multiple
          autocomplete=""
          :items="departmentItems"
          :placeholder="t('page.actualReports.filters.department.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="year"
        :label="t('page.actualReports.filters.year.label')"
        class="min-w-[12rem] flex-1"
      >
        <SingleLineInputMenu
          v-model="formState.year"
          multiple
          autocomplete=""
          :items="yearItems"
          :placeholder="t('page.actualReports.filters.year.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="weekFrom"
        :label="t('page.actualReports.filters.weekFrom.label')"
        class="min-w-[14rem] flex-1"
      >
        <SingleLineInputMenu
          v-model="formState.weekFrom"
          multiple
          autocomplete=""
          :items="weekItems"
          :placeholder="t('page.actualReports.filters.weekFrom.placeholder')"
        />
      </B24FormField>

      <B24FormField
        name="weekTo"
        :label="t('page.actualReports.filters.weekTo.label')"
        class="min-w-[14rem] flex-1"
      >
        <SingleLineInputMenu
          v-model="formState.weekTo"
          multiple
          autocomplete=""
          :items="weekItems"
          :placeholder="t('page.actualReports.filters.weekTo.placeholder')"
        />
      </B24FormField>

      <B24FieldGroup>
        <B24Button class="border! rounded-l-(--ui-border-radius-sm)!">
          {{ t("page.actualReports.filters.onlyFree.label") }}
        </B24Button>
        <div
          class="w-fit relative flex items-center self-stretch [padding-inline:0.875rem] [background:var(--ui-btn-background,var(--ui-color-background-primary))] border! border-solid rounded-r-(--ui-border-radius-sm) border-(--ui-color-design-outline-na-stroke)"
        >
          <B24Switch v-model="formState.onlyFree" name="onlyFree" />
        </div>
      </B24FieldGroup>

      <B24Button
        type="submit"
        color="air-primary"
        :icon="RefreshIcon"
        :aria-label="t('page.actualReports.filters.submit')"
      />
    </section>
  </B24Form>
</template>
