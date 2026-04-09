<script setup lang="ts">
import type { FormSubmitEvent } from "@bitrix24/b24ui-nuxt";
import type { components } from "~~/shared/types/generated/api";

const userStore = useUserStore();
const { users } = storeToRefs(userStore);
const { $api } = useNuxtApp();
const { isWaiting, wait } = useWait();

const { t } = useI18n();
const isSubmitting = isWaiting("settings.favorite-users.submit");

type AddUserFavoritesRequestDto =
  components["schemas"]["AddUserFavoritesRequestDto"];
type GetUserFavoriteResponseDto =
  components["schemas"]["GetUserFavoriteResponseDto"];
type GetUserFavoritesResponseDto =
  components["schemas"]["GetUserFavoritesResponseDto"];
type UserLineItem = {
  id: string;
  label: string;
};

const favoriteUsers = ref<GetUserFavoriteResponseDto[]>([]);

const formState = reactive<{
  favoriteUsers: string[];
}>({
  favoriteUsers: [],
});

const loadFavorites = async () => {
  const response = await $api<GetUserFavoritesResponseDto>(
    "/api/users/me/favorites",
  );

  favoriteUsers.value = response.favorites;
  formState.favoriteUsers = [
    ...new Set(response.favorites.map((favorite) => favorite.favoriteUserId)),
  ];
};

await Promise.all([userStore.fetchUsers(), loadFavorites()]);

const userItems = computed<UserLineItem[]>(() => {
  const itemsById = new Map<string, UserLineItem>();

  for (const user of users.value) {
    itemsById.set(user.id, {
      id: user.id,
      label: user.displayName,
    });
  }

  for (const favorite of favoriteUsers.value) {
    if (itemsById.has(favorite.favoriteUserId)) {
      continue;
    }

    itemsById.set(favorite.favoriteUserId, {
      id: favorite.favoriteUserId,
      label: favorite.favoriteUserDisplayName,
    });
  }

  return Array.from(itemsById.values());
});

const hasChanges = computed(() => {
  const selectedFavoriteUserIds = [
    ...new Set(formState.favoriteUsers),
  ].sort();
  const currentFavoriteUserIds = [
    ...new Set(
      favoriteUsers.value.map((favorite) => favorite.favoriteUserId),
    ),
  ].sort();

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
    const selectedFavoriteUserIds = [...new Set(formState.favoriteUsers)];

    const currentFavoriteUserIds = new Set(
      favoriteUsers.value.map((favorite) => favorite.favoriteUserId),
    );

    const favoriteUserIdsToAdd = selectedFavoriteUserIds.filter(
      (favoriteUserId) => !currentFavoriteUserIds.has(favoriteUserId),
    );
    const favoriteIdsToDelete = favoriteUsers.value
      .filter(
        (favorite) =>
          !selectedFavoriteUserIds.includes(favorite.favoriteUserId),
      )
      .map((favorite) => favorite.favoriteId);

    await Promise.all([
      ...favoriteUserIdsToAdd.map((favoriteUserId) =>
        $api("/api/users/me/favorites", {
          method: "POST",
          body: {
            favoriteUserId,
          } satisfies AddUserFavoritesRequestDto,
        }),
      ),
      ...favoriteIdsToDelete.map((favoriteId) =>
        $api(`/api/users/me/favorites/${favoriteId}`, {
          method: "DELETE",
        }),
      ),
    ]);

    await loadFavorites();
  });
};

useHead({
  title: `${t("page.index.navigation.settings")} | ${t("page.index.header.title")}`,
});
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
