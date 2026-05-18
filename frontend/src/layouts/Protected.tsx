import type { RouteSectionProps } from "@solidjs/router";
import { AuthProvider } from "~/context/Auth";

export default function Protected(props: RouteSectionProps) {
  return <AuthProvider>{props.children}</AuthProvider>;
}
