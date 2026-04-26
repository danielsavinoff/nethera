import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { GalleryVerticalEnd } from "lucide-solid";

import type { JSX } from "solid-js";

type LoginFormProps = JSX.HTMLAttributes<HTMLDivElement>;

export function LoginForm(props: LoginFormProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div class={cn("flex flex-col gap-6", local.class)} {...others}>
      <form>
        <div class="flex flex-col items-center gap-2 text-center">
          <a href="#" class="flex flex-col items-center gap-2 font-medium">
            <div class="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd class="size-6" />
            </div>
            <span class="sr-only">Acme Inc.</span>
          </a>
          <h1 class="text-xl font-bold">Welcome to Acme Inc.</h1>
        </div>
      </form>
    </div>
  );
}
