import {
  createSignal,
  mergeProps,
  onCleanup,
  Show,
  splitProps,
} from "solid-js";
import { cn } from "~/lib/utils";
import { ArrowLeft, GalleryVerticalEnd } from "lucide-solid";

import type { JSX } from "solid-js";
import { Button } from "./ui/Button";

type CheckYourEmailProps = JSX.HTMLAttributes<HTMLDivElement> & {
  resendCooldown?: number;
  onBack?: () => unknown;
};

export function CheckYourEmail(props: CheckYourEmailProps) {
  const finalProps = mergeProps({ resendCooldown: 0 }, props);

  const [local, others] = splitProps(finalProps, ["class", "resendCooldown"]);

  const [cooldown, setCooldown] = createSignal<number>(local.resendCooldown);

  const timer = setInterval(() => {
    setCooldown((previousValue) => {
      if (!previousValue || previousValue <= 0) {
        return previousValue;
      }

      return previousValue - 1;
    });
  }, 1000);

  onCleanup(() => {
    clearInterval(timer);
  });

  const handleResend = () => {
    if (cooldown()) {
      return;
    }

    setCooldown(local.resendCooldown);
  };

  const handleBack = () => {
    if (!props.onBack) {
      return;
    }

    props.onBack();
  };

  return (
    <div class={cn("flex flex-col gap-6", local.class)} {...others}>
      <form>
        <div class="flex flex-col gap-7">
          <div class="flex flex-col items-center gap-2 text-center">
            <a href="#" class="flex flex-col items-center gap-2 font-medium">
              <div class="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd class="size-6" />
              </div>
              <span class="sr-only">Acme Inc.</span>
            </a>
            <h1 class="text-xl font-bold">Check your email</h1>
          </div>
          <div class="text-center">
            <p class="text-sm font-medium text-muted-foreground">
              We emailed you the magic link to sign in to your account. You can
              close this window and check your inbox.
            </p>
          </div>
          <div class="space-y-2">
            <Button
              class="w-full"
              type="submit"
              onClick={handleResend}
              disabled={Boolean(cooldown())}
            >
              <Show when={!cooldown()} fallback={`${cooldown()}`}>
                Send an email again
              </Show>
            </Button>
            <Button class="w-full" variant={"outline"} onClick={handleBack}>
              Back
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
