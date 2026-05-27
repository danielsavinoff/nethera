import axios from "axios";
import {
  createContext,
  createResource,
  useContext,
  type ParentProps,
} from "solid-js";
import { subscriptionControllerHandleGetCurrentSubscription } from "~/api/generated";
import { useAuth } from "~/context/Auth";

export interface Subscription {
  id: string;
  expiresAt?: string;
  name?: string;
}

type SubscriptionContextValue = {
  subscription: () => Subscription | null;
  refetch: () => Promise<unknown> | unknown;
  isLoaded: () => boolean;
  isLoading: () => boolean;
};

async function fetchCurrentSubscription() {
  try {
    const response = await subscriptionControllerHandleGetCurrentSubscription();

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export const SubscriptionContext = createContext<SubscriptionContextValue>();

export function SubscriptionProvider(props: ParentProps) {
  const { isLoaded: canFetch } = useAuth();

  const [currentSubscription, { refetch }] = createResource(
    canFetch,
    fetchCurrentSubscription,
  );

  const subscription = () => {
    const current = currentSubscription();

    if (!current) {
      return null;
    }

    return {
      id: current.id,
      expiresAt: current.expiresAt,
      name: current.subscriptionPlan?.name,
    };
  };

  const isLoading = () => currentSubscription.loading;

  const isLoaded = () => currentSubscription.state !== "pending";

  return (
    <SubscriptionContext.Provider
      value={{
        subscription: () => subscription(),
        refetch: refetch,
        isLoaded: isLoaded,
        isLoading: isLoading,
      }}
    >
      {props.children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const value = useContext(SubscriptionContext);

  if (!value) {
    throw new Error("Missing SubscriptionContext");
  }

  return value;
}
