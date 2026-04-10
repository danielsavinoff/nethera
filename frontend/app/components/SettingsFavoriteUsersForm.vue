<script setup lang="ts">
import type { FormSubmitEvent } from "@bitrix24/b24ui-nuxt";
import type {
  UserPickerItem,
  UserPickerLoadState,
} from "~~/app/composables/useUserPickerPageState";

const favoriteUsersStore = useFavoriteUsersStore();
const { favoriteItems, favoriteUserIds } = storeToRefs(favoriteUsersStore);
const { isWaiting, wait } = useWait();
const { t } = useI18n();

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

const isSubmitting = isWaiting("settings.favorite-users.submit");

const formState = reactive<{
  favoriteUsers: string[];
}>({
  favoriteUsers: [],
});

const syncFormState = () => {
  formState.favoriteUsers = [...favoriteUserIds.value];
};

await Promise.all([
  favoriteUsersStore.fetchFavorites(),
]);
syncFormState();

const userItems = computed<UserPickerItem[]>(() =>
  Array.from(
    new Map(
      [...props.users, ...favoriteItems.value].map((item) => [
        item.id,
        item,
      ]),
    ).values(),
  ),
);

const hasChanges = computed(() => {
  const selectedFavoriteUserIds = [
    ...new Set(formState.favoriteUsers),
  ].sort();
  const currentFavoriteUserIds = [...favoriteUserIds.value].sort();

  if (
    selectedFavoriteUserIds.length !==
    currentFavoriteUserIds.length
  ) {
    return true;
  }

  return selectedFavoriteUserIds.some(
    (favoriteUserId, index) =>
      favoriteUserId !== currentFavoriteUserIds[index],
  );
});

type SettingsFormState = typeof formState;

const onSubmit = async (_event: FormSubmitEvent<SettingsFormState>) => {
  await wait("settings.favorite-users.submit", async () => {
    await favoriteUsersStore.saveFavoriteUsers(
      formState.favoriteUsers,
    );
    syncFormState();
  });
};
</script>

<template>
  <B24Form :state="formState" @submit="onSubmit">
    <section class="flex flex-col gap-4">
      <B24FormField
        name="favoriteUsers"
        :label="t('page.settings.favoriteUsers.label')"
      >
        <UserLineInputMenu
          v-model="formState.favoriteUsers"
          v-model:search-term="query"
          multiple
          open-on-focus
          autocomplete=""
          :items="userItems"
          :search-state="props.searchState"
          :browse-state="props.browseState"
          :load-next-search="props.loadNextSearch"
          :load-department-users="props.loadDepartmentUsers"
          :reset-search="props.resetSearch"
          value-key="id"
          label-key="label"
          :placeholder="t('page.settings.favoriteUsers.placeholder')"
        />
      </B24FormField>

      <B24Button
        type="submit"
        color="success"
        class="self-start"
        :loading="isSubmitting"
        :disabled="isSubmitting || !hasChanges"
        use-wait
      >
        {{ t("page.settings.save") }}
      </B24Button>
    </section>
  </B24Form>
</template>
