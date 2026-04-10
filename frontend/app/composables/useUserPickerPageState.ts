import { computed, reactive, ref, watchEffect } from "vue";
import type { components, operations } from "~~/shared/types/generated/api";

type GetUsersResponseDto = components["schemas"]["GetUsersResponseDto"];
type GetDepartmentUsersResponseDto =
  components["schemas"]["GetDepartmentUsersResponseDto"];
type GetUsersQuery =
  operations["UserController_handleGetUsers"]["parameters"]["query"];

export type UserPickerItem = {
  id: string;
  label: string;
};

export type UserPickerLoadState = {
  users: UserPickerItem[];
  page: number;
  total: number;
  limit: number;
  loading: boolean;
  loaded: boolean;
  hasMore: boolean;
};

export type UserPickerDepartmentLoadState = {
  users: UserPickerItem[];
  loading: boolean;
  loaded: boolean;
};

export type UserPickerBrowseState = UserPickerLoadState & {
  departmentStates: Record<string, UserPickerDepartmentLoadState>;
};

type InternalUserPickerLoadState = UserPickerLoadState & {
  currentQuery: string;
};

type InternalUserPickerBrowseState = UserPickerBrowseState;

const createLoadState = (): InternalUserPickerLoadState => ({
  users: [],
  page: 0,
  total: 0,
  limit: 100,
  loading: false,
  loaded: false,
  hasMore: false,
  currentQuery: "",
});

const createBrowseState = (): InternalUserPickerBrowseState => ({
  users: [],
  page: 0,
  total: 0,
  limit: 0,
  loading: false,
  loaded: false,
  hasMore: false,
  departmentStates: {},
});

const mapUsers = (
  users: GetUsersResponseDto["users"],
): UserPickerItem[] =>
  users.map((user) => ({
    id: user.id,
    label: user.displayName,
  }));

const mapDepartmentUsers = (
  users: GetDepartmentUsersResponseDto["users"],
): UserPickerItem[] =>
  users.map((user) => ({
    id: user.id,
    label: user.displayName,
  }));

const mergeUsers = (users: UserPickerItem[]): UserPickerItem[] => {
  const itemsById = new Map<string, UserPickerItem>();

  for (const user of users) {
    if (itemsById.has(user.id)) {
      continue;
    }

    itemsById.set(user.id, user);
  }

  return Array.from(itemsById.values());
};

export const useUserPickerPageState = () => {
  const { $api } = useNuxtApp();
  const departmentStore = useDepartmentStore();
  const query = ref("");
  const searchState = reactive(createLoadState());
  const browseState = reactive(createBrowseState());

  const users = computed(() =>
    mergeUsers([
      ...browseState.users,
      ...searchState.users,
    ]),
  );

  const getDepartmentState = (
    departmentExternalId: string,
  ): UserPickerDepartmentLoadState => {
    if (!browseState.departmentStates[departmentExternalId]) {
      browseState.departmentStates[departmentExternalId] = {
        users: [],
        loading: false,
        loaded: false,
      };
    }

    return browseState.departmentStates[departmentExternalId];
  };

  const syncBrowseState = () => {
    browseState.users = mergeUsers(
      Object.values(browseState.departmentStates).flatMap(
        (state) => state.users,
      ),
    );
    browseState.page = 0;
    browseState.total = browseState.users.length;
    browseState.limit = 0;
    browseState.loading = Object.values(
      browseState.departmentStates,
    ).some((state) => state.loading);
    browseState.loaded = departmentStore.loaded;
    browseState.hasMore = false;
  };

  const resetState = (state: InternalUserPickerLoadState) => {
    state.users = [];
    state.page = 0;
    state.total = 0;
    state.loading = false;
    state.loaded = false;
    state.hasMore = false;
  };

  const loadPage = async (
    state: InternalUserPickerLoadState,
    options?: {
      q?: string;
      reset?: boolean;
    },
  ) => {
    if (state.loading) {
      return;
    }

    if (options?.reset) {
      resetState(state);
    } else if (state.page > 0 && !state.hasMore) {
      return;
    }

    state.loading = true;

    try {
      const nextPage = state.page + 1;
      const apiQuery: GetUsersQuery = {
        active: true,
        limit: state.limit,
        page: nextPage,
        q: options?.q,
      };

      const response = await $api<GetUsersResponseDto>("/api/users", {
        query: apiQuery,
      });
      const nextUsers = mapUsers(response.users);

      state.users =
        nextPage === 1
          ? nextUsers
          : mergeUsers([...state.users, ...nextUsers]);
      state.page = response.page;
      state.total = response.total;
      state.loaded = true;
      state.hasMore = state.users.length < response.total;
    } finally {
      state.loading = false;
    }
  };

  const loadDepartmentUsers = async (
    departmentExternalId: string,
  ) => {
    const departmentState = getDepartmentState(
      departmentExternalId,
    );

    if (departmentState.loading) {
      return;
    }

    departmentState.loaded = false;
    departmentState.loading = true;
    syncBrowseState();

    try {
      const response = await $api<GetDepartmentUsersResponseDto>(
        `/api/departments/external/${departmentExternalId}/users`,
        {
          query: {
            active: true,
          },
        },
      );

      departmentState.users = mapDepartmentUsers(response.users);
      departmentState.loaded = true;
    } finally {
      departmentState.loading = false;
      syncBrowseState();
    }
  };

  const loadNextSearch = async (nextQuery = query.value) => {
    const normalizedQuery = nextQuery.trim();

    query.value = nextQuery;

    if (!normalizedQuery) {
      resetSearch();
      return;
    }

    const shouldReset = searchState.currentQuery !== normalizedQuery;

    searchState.currentQuery = normalizedQuery;

    await loadPage(searchState, {
      q: normalizedQuery,
      reset: shouldReset,
    });
  };

  const resetSearch = () => {
    query.value = "";
    searchState.currentQuery = "";
    resetState(searchState);
  };

  watchEffect(() => {
    browseState.loaded = departmentStore.loaded;
  });

  return {
    users,
    searchState: searchState as UserPickerLoadState,
    browseState: browseState as UserPickerBrowseState,
    query,
    loadNextSearch,
    loadDepartmentUsers,
    resetSearch,
  };
};
