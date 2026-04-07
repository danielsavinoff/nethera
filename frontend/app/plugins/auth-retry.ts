export default defineNuxtPlugin(() => {
  const { getAuthData, getLanguage } = useBitrixAuth();

  let refreshPromise: Promise<void> | null = null;

  async function refreshOnce() {
    if (!refreshPromise) {
      refreshPromise = $fetch<void>('/api/auth/token', {
        method: 'POST',
        credentials: 'include',
      }).finally(() => (refreshPromise = null));
    }

    return refreshPromise;
  }

  async function reauthViaBitrix() {
    const authData = await getAuthData();

    if (!authData) {
      throw new Error('No auth data from Bitrix24');
    }

    const language = await getLanguage();

    await $fetch('/api/auth/login/oauth', {
      method: 'POST',
      credentials: 'include',
      body: {
        accessToken: authData.access_token,
        refreshToken: authData.refresh_token,
        expires: Number(authData.expires ?? 0),
        expiresIn: Number(authData.expires_in ?? 0),
        domain: authData.domain,
        memberId: authData.member_id,
        language,
      },
    });
  }

  const raw = $fetch.create({ credentials: 'include' });

  async function api<T>(request: any, options: any = {}): Promise<T> {
    try {
      return await raw<T>(request, options);
    } catch (error: any) {
      if (
        error?.response?.status !== 401 ||
        options._retried
      ) {
        throw error;
      }

      try {
        await refreshOnce();

        return await raw<T>(request, {
          ...options,
          _retried: true,
        });
      } catch {}

      await reauthViaBitrix();

      return await raw<T>(request, {
        ...options,
        _retried: true,
      });
    }
  }

  return { provide: { api } };
});
