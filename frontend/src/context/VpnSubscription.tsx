import axios from "axios";
import {
  createContext,
  createResource,
  useContext,
  type ParentProps,
} from "solid-js";
import { vpnSubscriptionControllerHandleGetCurrentVpnSubscription } from "~/api/generated";
import { useSubscription } from "~/context/Subscription";

export interface VpnSubscription {
  username: string;
  url: string;
}

type VpnSubscriptionContextValue = {
  vpnSubscription: () => VpnSubscription | null;
  refetch: () => Promise<unknown> | unknown;
  isLoaded: () => boolean;
  isLoading: () => boolean;
};

async function fetchCurrentVpnSubscription() {
  try {
    const response =
      await vpnSubscriptionControllerHandleGetCurrentVpnSubscription();

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export const VpnSubscriptionContext =
  createContext<VpnSubscriptionContextValue>();

export function VpnSubscriptionProvider(props: ParentProps) {
  const { isLoaded: canFetch } = useSubscription();

  const [currentVpnSubscription, { refetch }] = createResource(
    canFetch,
    fetchCurrentVpnSubscription,
  );

  const vpnSubscription = () => {
    const current = currentVpnSubscription();

    if (!current) {
      return null;
    }

    return {
      username: current.username,
      url: current.subscriptionUrl,
    };
  };

  const isLoading = () => currentVpnSubscription.loading;

  const isLoaded = () => currentVpnSubscription.state !== "pending";

  return (
    <VpnSubscriptionContext.Provider
      value={{
        vpnSubscription: () => vpnSubscription(),
        refetch: refetch,
        isLoaded: isLoaded,
        isLoading: isLoading,
      }}
    >
      {props.children}
    </VpnSubscriptionContext.Provider>
  );
}

export function useVpnSubscription() {
  const value = useContext(VpnSubscriptionContext);

  if (!value) {
    throw new Error("Missing VpnSubscriptionContext");
  }

  return value;
}
