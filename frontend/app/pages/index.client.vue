<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: t("page.index.seo.title"),
});

const userItems = ref(["Alex Johnson", "Maria Petrova", "Daniel Kim"]);
const yearItems = ref(["2024", "2025", "2026"]);
const weekItems = ref(["Week 12", "Week 13", "Week 14", "Week 15"]);

const selectedUser = ref(["Alex Johnson"]);
const selectedYear = ref(["2026"]);
const selectedWeek = ref(["Week 14"]);

const keepLastSelection = (values: string[]) => {
  if (values.length > 1) {
    return values.slice(-1);
  }

  return values;
};

watch(selectedUser, (values) => {
  selectedUser.value = keepLastSelection(values);
});

watch(selectedYear, (values) => {
  selectedYear.value = keepLastSelection(values);
});

watch(selectedWeek, (values) => {
  selectedWeek.value = keepLastSelection(values);
});
</script>

<template>
  <section class="flex w-full flex-wrap gap-4">
    <B24FormField
      name="user"
      :label="t('page.index.filters.user.label')"
      class="min-w-[16rem] flex-1"
    >
      <B24InputMenu
        v-model="selectedUser"
        multiple
        autocomplete=""
        :items="userItems"
        :placeholder="t('page.index.filters.user.placeholder')"
      />
    </B24FormField>

    <B24FormField
      name="year"
      :label="t('page.index.filters.year.label')"
      class="min-w-[12rem] flex-1"
    >
      <B24InputMenu
        v-model="selectedYear"
        multiple
        autocomplete=""
        :items="yearItems"
        :placeholder="t('page.index.filters.year.placeholder')"
      />
    </B24FormField>

    <B24FormField
      name="week"
      :label="t('page.index.filters.week.label')"
      class="min-w-[14rem] flex-1"
    >
      <B24InputMenu
        v-model="selectedWeek"
        multiple
        autocomplete=""
        :items="weekItems"
        :placeholder="t('page.index.filters.week.placeholder')"
      />
    </B24FormField>
  </section>
</template>
