import { createEffect } from "solid-js";
import { useNavigate, type RouteSectionProps } from "@solidjs/router";

import { useAuth } from "~/context/Auth";

export default function Protected(props: RouteSectionProps) {
  const navigate = useNavigate();

  const { user, refetch, isInitialized } = useAuth();

  createEffect(async () => {
    if (!isInitialized()) {
      await refetch();
    }

    if (!user) {
      navigate("/login");
    }
  });

  return <>{props.children}</>;
}
