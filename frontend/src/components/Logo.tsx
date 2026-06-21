import type { JSX } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "~/lib/utils";

type LogoProps = JSX.SvgSVGAttributes<SVGSVGElement>;

export function Logo(props: LogoProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2000 1036.8"
      fill="currentColor"
      class={cn("shrink-0", local.class)}
      {...others}
    >
      <polygon points="2000 0 1588.6 0 1169.2 573.5 1169.2 .5 481.2 .5 187.1 402.6 463.9 402.6 0 1036.8 411.4 1036.8 830.8 463.3 830.8 1036.8 1518.1 1036.3 1812.1 634.3 1536.1 634.3 2000 0" />
    </svg>
  );
}
