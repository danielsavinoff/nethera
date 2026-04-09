<script setup lang="ts">
import type { FormSubmitEvent } from "@bitrix24/b24ui-nuxt";

const userStore = useUserStore();
const { users } = storeToRefs(userStore);

const { t } = useI18n();

await userStore.fetchUsers();

const formState = reactive({
  favoriteUsers: [],
});

const userItems = computed(() => users.value.map((user) => user.displayName));

type SettingsFormState = typeof formState;

const onSubmit = async (_event: FormSubmitEvent<SettingsFormState>) => {};

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
          :placeholder="t('page.settings.favoriteUsers.placeholder')"
        />
      </B24FormField>

      <B24Button type="submit" color="success" class="self-start">
        {{ t("page.settings.save") }}
      </B24Button>
    </section>
  </B24Form>
</template>
