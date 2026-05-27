import {
  createContext,
  createEffect,
  createResource,
  useContext,
  type ParentProps,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  type GetCurrentUserResponseDtoPermissionsItem,
  userControllerHandleGetMe,
} from "~/api/generated";

export const Permission = {
  SubscriptionPlanViewAny: "subscription-plan.view.any",
  SubscriptionPlanViewPublic: "subscription-plan.view.public",
  SubscriptionPlanAddAny: "subscription-plan.add.any",
  SubscriptionViewOwn: "subscription.view.own",
  SubscriptionViewAny: "subscription.view.any",
  SubscriptionCancelOwn: "subscription.cancel.own",
  SubscriptionCancelAny: "subscription.cancel.any",
  VpnSubscriptionViewOwn: "vpn-subscription.view.own",
  VpnSubscriptionViewAny: "vpn-subscription.view.any",
  InvoiceViewOwn: "invoice.view.own",
  InvoiceViewAny: "invoice.view.any",
  PaymentViewOwn: "payment.view.own",
  PaymentViewAny: "payment.view.any",
  UserRoleViewOwn: "user-role.view.own",
  UserRoleViewAny: "user-role.view.any",
  UserRoleUpdateAny: "user-role.update.any",
  UserRoleDeleteAny: "user-role.delete.any",
  UserViewOwn: "user.view.own",
  UserViewAny: "user.view.any",
  UserLocaleUpdateOwn: "user.locale.update.own",
  UserLocaleUpdateAny: "user.locale.update.any",
  UserCurrencyUpdateOwn: "user.currency.update.own",
  UserCurrencyUpdateAny: "user.currency.update.any",
  UserDeleteOwn: "user.delete.own",
  UserDeleteAny: "user.delete.any",
} as const satisfies Record<string, GetCurrentUserResponseDtoPermissionsItem>;

export type Permission = GetCurrentUserResponseDtoPermissionsItem;

export interface User {
  id: string;
  displayName: string;
  email: string;
  locale: string;
  preferredCurrencyCode: string;
  permissions: Permission[] | null;
}

export interface Auth {
  user: User | null;
}

type AuthContextValue = {
  user: () => Auth["user"];
  refetch: () => Promise<unknown> | unknown;
  isLoaded: () => boolean;
  isLoading: () => boolean;
};

async function fetchMe(): Promise<User> {
  const { data: user } = await userControllerHandleGetMe();

  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    locale: user.locale,
    preferredCurrencyCode: user.preferredCurrencyCode,
    permissions: user.permissions,
  };
}

export const AuthContext = createContext<AuthContextValue>();

export function AuthProvider(props: ParentProps) {
  const [store, setStore] = createStore<Auth>({
    user: null,
  });

  const [currentUser, { refetch }] = createResource(fetchMe);

  const isLoading = () => currentUser.loading;

  const isLoaded = () => currentUser.state !== "pending";

  createEffect(() => {
    const user = currentUser();

    if (!isLoading() && user) {
      setStore({
        user: user,
      });
    }
  });

  return (
    <AuthContext.Provider
      value={{
        user: () => store.user,
        refetch: refetch,
        isLoaded: isLoaded,
        isLoading: isLoading,
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
