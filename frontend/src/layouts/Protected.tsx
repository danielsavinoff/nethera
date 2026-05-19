import { createEffect } from "solid-js";
import { redirect, useNavigate, type RouteSectionProps } from "@solidjs/router";

import { useAuth } from "~/context/Auth";

export default function Protected(props: RouteSectionProps) {
  const navigate = useNavigate();

  const { auth, refetchAuth } = useAuth();

  createEffect(async () => {
    if (!auth.isInitialized) {
      await refetchAuth();
    }

    if (!auth.user) {
      navigate("/login");
    }
  });

  return <>{props.children}</>;
}
