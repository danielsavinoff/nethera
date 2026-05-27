import { useNavigate, type RouteSectionProps } from "@solidjs/router";
import { createEffect } from "solid-js";

import { useAuth } from "~/context/Auth";

export default function GuestOnly(props: RouteSectionProps) {
  const navigate = useNavigate();

  const { user, isLoaded, isLoading, refetch } = useAuth();

  createEffect(async () => {
    if (isLoading()) {
      return;
    }

    if (!isLoaded()) {
      await refetch();
    }

    if (import.meta.env.DEV) {
      return;
    }

    if (user()) {
      navigate("/");
    }
  });

  return <>{props.children}</>;
}
