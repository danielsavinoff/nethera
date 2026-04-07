export function useBitrixAuth() {
  const { $initializeB24Frame } = useNuxtApp();

  async function getAuthData() {
    const b24 = await $initializeB24Frame();
    return b24.auth.getAuthData();
  }

  async function getLanguage() {
    const b24 = await $initializeB24Frame();
    return b24.getLang();
  }

  return { getAuthData, getLanguage };
}
