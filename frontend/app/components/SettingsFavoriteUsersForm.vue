<script setup lang="ts">
import type { FormSubmitEvent } from "@bitrix24/b24ui-nuxt";

type UserLineItem = {
  id: string;
  label: string;
};

const userStore = useUserStore();
const favoriteUsersStore = useFavoriteUsersStore();
const { users, hasMoreUsers, usersLoadingMore } = storeToRefs(userStore);
const { favoriteItems, favoriteUserIds } = storeToRefs(favoriteUsersStore);
const { isWaiting, wait } = useWait();
const { t } = useI18n();

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
  userStore.fetchUsers(),
  favoriteUsersStore.fetchFavorites(),
]);
syncFormState();

const userItems = computed<UserLineItem[]>(() => {
  const itemsById = new Map<string, UserLineItem>();

  for (const user of users.value) {
    itemsById.set(user.id, {
      id: user.id,
      label: user.displayName,
    });
  }

  for (const favoriteItem of favoriteItems.value) {
    if (itemsById.has(favoriteItem.id)) {
      continue;
    }

    itemsById.set(favoriteItem.id, favoriteItem);
  }

  return Array.from(itemsById.values());
});

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
          multiple
          open-on-focus
          autocomplete=""
          :items="userItems"
          :has-more="hasMoreUsers"
          :loading="usersLoadingMore"
          value-key="id"
          label-key="label"
          :placeholder="t('page.settings.favoriteUsers.placeholder')"
          @load-more="userStore.loadMoreUsers()"
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
