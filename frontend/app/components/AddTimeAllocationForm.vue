<script setup lang="ts">
const props = defineProps<{
  form: {
    group: string;
    hours: number;
    task: string;
    weekNumber: string;
    assignee: string;
    assigner: string;
    year: string;
    automaticApproval: boolean;
    priority: string;
  };
}>();

const { t } = useI18n();

const HOUR_STEP = 0.25;

const formatHours = (value: number) =>
  value
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1")
    .replace(".", ",");

const updateHours = (direction: -1 | 1) => {
  const nextValue = Number(
    (props.form.hours + direction * HOUR_STEP).toFixed(2),
  );

  props.form.hours = Math.max(0, nextValue);
};

const automaticApprovalItems = computed(() => [
  t("page.requests.dialog.automaticApproval.yes"),
  t("page.requests.dialog.automaticApproval.no"),
]);

const automaticApprovalValue = computed({
  get: () =>
    props.form.automaticApproval
      ? t("page.requests.dialog.automaticApproval.yes")
      : t("page.requests.dialog.automaticApproval.no"),
  set: (value: string) => {
    props.form.automaticApproval =
      value === t("page.requests.dialog.automaticApproval.yes");
  },
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <B24FormField
      name="group"
      :label="t('page.requests.dialog.group.label')"
      :b24ui="{
        wrapper: 'mb-2',
      }"
      class="text-base"
    >
      <B24Input
        v-model="props.form.group"
        size="lg"
        class="w-full"
        :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
        :placeholder="t('page.requests.dialog.group.placeholder')"
      />
    </B24FormField>

    <B24FormField
      name="hours"
      :label="t('page.requests.dialog.hours.label')"
      :b24ui="{
        wrapper: 'mb-2',
      }"
      class="w-full text-base"
    >
      <B24FieldGroup class="w-full flex">
        <B24Button
          type="button"
          size="lg"
          color="air-secondary-no-accent"
          class="min-w-12 rounded-r-none border!"
          :aria-label="t('page.requests.dialog.hours.decrease')"
          @click="updateHours(-1)"
        >
          -
        </B24Button>
        <B24Input
          :model-value="formatHours(props.form.hours)"
          size="lg"
          class="flex-1"
          :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
        />
        <B24Button
          type="button"
          size="lg"
          color="air-secondary-no-accent"
          class="min-w-12 rounded-l-none border! after:content-none!"
          :aria-label="t('page.requests.dialog.hours.increase')"
          @click="updateHours(1)"
        >
          +
        </B24Button>
      </B24FieldGroup>
    </B24FormField>

    <B24FormField
      name="task"
      :label="t('page.requests.dialog.task.label')"
      :b24ui="{
        wrapper: 'mb-2',
      }"
      class="text-base font-semibold"
    >
      <B24Input
        v-model="props.form.task"
        size="lg"
        class="w-full"
        :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
        :placeholder="t('page.requests.dialog.task.placeholder')"
      />
    </B24FormField>

    <B24FormField
      name="weekNumber"
      :label="t('page.requests.dialog.weekNumber.label')"
      :b24ui="{
        wrapper: 'mb-2',
      }"
      class="text-base"
    >
      <B24Input
        v-model="props.form.weekNumber"
        size="lg"
        type="number"
        min="1"
        max="53"
        class="w-full"
        :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
        :placeholder="t('page.requests.dialog.weekNumber.placeholder')"
      />
    </B24FormField>

    <B24FormField
      name="assignee"
      :label="t('page.requests.dialog.assignee.label')"
      :b24ui="{
        wrapper: 'mb-2',
      }"
      class="text-base"
    >
      <B24Input
        v-model="props.form.assignee"
        size="lg"
        class="w-full"
        :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
        :placeholder="t('page.requests.dialog.assignee.placeholder')"
      />
    </B24FormField>

    <B24FormField
      name="assigner"
      :label="t('page.requests.dialog.assigner.label')"
      :b24ui="{
        wrapper: 'mb-2',
      }"
      class="text-base"
    >
      <B24Input
        v-model="props.form.assigner"
        size="lg"
        class="w-full"
        :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
        :placeholder="t('page.requests.dialog.assigner.placeholder')"
      />
    </B24FormField>

    <B24FormField
      name="year"
      :label="t('page.requests.dialog.year.label')"
      :b24ui="{
        wrapper: 'mb-2',
      }"
      class="text-base"
    >
      <B24Input
        v-model="props.form.year"
        size="lg"
        class="w-full"
        :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
        type="number"
        min="2000"
        :placeholder="t('page.requests.dialog.year.placeholder')"
      />
    </B24FormField>

    <B24FormField
      name="priority"
      :label="t('page.requests.dialog.priority.label')"
      :b24ui="{
        wrapper: 'mb-2',
      }"
      class="text-base"
    >
      <B24Input
        v-model="props.form.priority"
        size="lg"
        class="w-full"
        :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
        :placeholder="t('page.requests.dialog.priority.placeholder')"
      />
    </B24FormField>

    <B24FormField
      name="automaticApproval"
      class="w-full text-base"
      :label="t('page.requests.dialog.automaticApproval.label')"
      :b24ui="{
        wrapper: 'mb-2',
      }"
    >
      <SingleLineInputMenu
        v-model="automaticApprovalValue"
        :items="automaticApprovalItems"
        size="lg"
        class="w-full"
        :b24ui="{ base: '[--tw-ring-color:var(--ui-color-base-5)]!' }"
      />
    </B24FormField>

    <p class="text-sm text-(--ui-color-base-3)">
      {{ t("page.requests.dialog.stub") }}
    </p>
  </div>
</template>
