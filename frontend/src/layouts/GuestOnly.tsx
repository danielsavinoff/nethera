import { useNavigate, type RouteSectionProps } from "@solidjs/router";
import { createEffect } from "solid-js";

import { useAuth } from "~/context/Auth";

export default function GuestOnly(props: RouteSectionProps) {
  const navigate = useNavigate();

  const { auth, refetchAuth } = useAuth();

  createEffect(async () => {
    if (!auth.isInitialized) {
      await refetchAuth();
    }

    if (auth.user) {
      navigate("/");
    }
  });

  return <>{props.children}</>;
}
