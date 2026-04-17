<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  initialTask?: string;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const { t } = useI18n();
const { currentYear } = useYears();

const isMobile = useIsMobile();

const addTimeAllocationForm = reactive({
  group: "",
  hours: 0,
  task: "",
  weekNumber: "",
  assignee: "",
  assigner: "",
  year: String(currentYear),
  automaticApproval: false,
  priority: "",
});

const resetAddTimeAllocationForm = (taskName = "") => {
  addTimeAllocationForm.group = "";
  addTimeAllocationForm.hours = 0;
  addTimeAllocationForm.task = taskName;
  addTimeAllocationForm.weekNumber = "";
  addTimeAllocationForm.assignee = "";
  addTimeAllocationForm.assigner = "";
  addTimeAllocationForm.year = String(currentYear);
  addTimeAllocationForm.automaticApproval = false;
  addTimeAllocationForm.priority = "";
};

const handleOpenChange = (open: boolean) => {
  emit("update:open", open);

  if (!open) {
    resetAddTimeAllocationForm();
  }
};

watch(
  () => [props.open, props.initialTask] as const,
  ([open, initialTask]) => {
    if (!open) {
      return;
    }

    resetAddTimeAllocationForm(initialTask ?? "");
  },
  { immediate: true },
);
</script>

<template>
  <B24Slideover
    v-if="isMobile"
    :open="props.open"
    :title="t('page.requests.dialog.title')"
    :description="t('page.requests.dialog.description')"
    @update:open="handleOpenChange"
  >
    <template #body>
      <AddTimeAllocationForm :form="addTimeAllocationForm" />
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <B24Button color="air-tertiary" @click="handleOpenChange(false)">
          {{ t("page.requests.dialog.cancel") }}
        </B24Button>
        <B24Button color="air-primary" disabled>
          {{ t("page.requests.dialog.submit") }}
        </B24Button>
      </div>
    </template>
  </B24Slideover>

  <B24Modal
    v-else
    :open="props.open"
    :title="t('page.requests.dialog.title')"
    :description="t('page.requests.dialog.description')"
    @update:open="handleOpenChange"
  >
    <template #body>
      <AddTimeAllocationForm :form="addTimeAllocationForm" />
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <B24Button color="air-tertiary" @click="handleOpenChange(false)">
          {{ t("page.requests.dialog.cancel") }}
        </B24Button>
        <B24Button color="air-primary" disabled>
          {{ t("page.requests.dialog.submit") }}
        </B24Button>
      </div>
    </template>
  </B24Modal>
</template>
