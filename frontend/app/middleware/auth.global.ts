import type { B24Frame } from "@bitrix24/b24jssdk";

export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const { $initializeB24Frame } = useNuxtApp();
    const $b24: B24Frame = await $initializeB24Frame();

    const authData = $b24.auth.getAuthData();
    console.log(authData);
  } catch (error) {
    console.log(error);
  }
});
