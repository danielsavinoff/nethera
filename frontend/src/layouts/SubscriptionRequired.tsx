import { useNavigate, type RouteSectionProps } from "@solidjs/router";
import { createEffect } from "solid-js";

import { useSubscription } from "~/context/Subscription";

export default function SubscriptionRequired(props: RouteSectionProps) {
  const navigate = useNavigate();

  const { subscription, refetch, isLoaded, isLoading } = useSubscription();

  createEffect(async () => {
    if (isLoading()) {
      return;
    }

    if (!isLoaded()) {
      await refetch();

      if (!isLoaded()) {
        return;
      }
    }

    if (!subscription()) {
      navigate("/plans");
    }
  });

  return <>{props.children}</>;
}
