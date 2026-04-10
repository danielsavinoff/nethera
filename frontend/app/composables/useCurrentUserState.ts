import type { components } from "~~/shared/types/generated/api";

export type CurrentUser = components["schemas"]["GetCurrentUserResponseDto"];

type CurrentUserBatchData = Record<string, unknown>;

export const useCurrentUserState = () => {
  const user = useState<CurrentUser | null>(
    "current-user",
    () => null,
  );
  const loaded = useState<boolean>(
    "current-user-loaded",
    () => false,
  );

  const fetchCurrent = async (force = false) => {
    if (loaded.value && !force) {
      return;
    }

    const { $api } = useNuxtApp();

    user.value = await $api<CurrentUser>("/api/users/me");
    loaded.value = true;
  };

  const initFromBatch = (data: CurrentUserBatchData) => {
    user.value = {
      ...(user.value ?? {}),
      ...data,
    } as CurrentUser;
    loaded.value = true;
  };

  return {
    user,
    loaded,
    fetchCurrent,
    initFromBatch,
  };
};
