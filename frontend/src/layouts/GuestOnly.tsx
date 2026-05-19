import { useNavigate, type RouteSectionProps } from "@solidjs/router";
import { createEffect } from "solid-js";

import { useAuth } from "~/context/Auth";

export default function GuestOnly(props: RouteSectionProps) {
  const navigate = useNavigate();

  const { user, isInitialized, isLoading, refetch } = useAuth();

  createEffect(async () => {
    if (!isInitialized() && !isLoading()) {
      await refetch();
    }

    if (user()) {
      navigate("/");
    }
  });

  return <>{props.children}</>;
}
