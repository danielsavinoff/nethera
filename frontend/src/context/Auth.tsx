import {
  createContext,
  createEffect,
  createResource,
  useContext,
  type ParentProps,
} from "solid-js";
import { createStore } from "solid-js/store";
import { userControllerHandleGetMe } from "~/api/generated";

export const Permission = {
  PlanViewAny: "plan.view.any",
  PlanAddAny: "plan.add.any",
  SubscriptionViewOwn: "subscription.view.own",
  SubscriptionViewAny: "subscription.view.any",
  UserRoleViewOwn: "user-role.view.own",
  UserRoleViewAny: "user-role.view.any",
  UserRoleUpdateAny: "user-role.update.any",
  UserRoleDeleteAny: "user-role.delete.any",
  UserViewOwn: "user.view.own",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export interface User {
  id: string;
  displayName: string;
  language: string;
  permissions: Permission[] | null;
}

export interface Auth {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
}

type AuthContextValue = {
  refetchAuth: () => Promise<unknown> | unknown;
  auth: Auth;
};

async function fetchMe(): Promise<User> {
  const { data: user } = await userControllerHandleGetMe();

  return {
    id: user.id,
    displayName: user.displayName,
    language: user.language,
    permissions: user.permissions,
  };
}

export const AuthContext = createContext<AuthContextValue>();

export function AuthProvider(props: ParentProps) {
  const [store, setStore] = createStore<Auth>({
    user: null,
    isLoading: true,
    isInitialized: false,
  });

  const [currentUser, { refetch }] = createResource(fetchMe);

  createEffect(() => {
    const user = currentUser();

    setStore({
      user: user ?? null,
      isLoading: false,
      isInitialized: true,
    });
  });

  return (
    <AuthContext.Provider
      value={{
        refetchAuth: refetch,
        auth: store,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("Missing AuthContext");
  }

  return value;
}
