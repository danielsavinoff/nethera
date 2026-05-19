import {
  createSignal,
  mergeProps,
  onCleanup,
  Show,
  splitProps,
} from "solid-js";
import { cn } from "~/lib/utils";
import { GalleryVerticalEnd, Loader } from "lucide-solid";

import type { JSX } from "solid-js";
import { Button } from "./ui/Button";
import { useLocale } from "~/context/Locale";

type CheckYourEmailProps = JSX.HTMLAttributes<HTMLDivElement> & {
  resendCooldown?: number;
  onBack?: () => unknown;
  onResend?: () => unknown;
  isResending?: boolean;
  error?: string | null;
};

export function CheckYourEmail(props: CheckYourEmailProps) {
  const { t } = useLocale();

  const finalProps = mergeProps({ resendCooldown: 0 }, props);

  const [local, others] = splitProps(finalProps, [
    "class",
    "resendCooldown",
    "onBack",
    "onResend",
    "isResending",
    "error",
  ]);

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

  const handleResend = async () => {
    if (cooldown()) {
      return;
    }

    const result = await local.onResend?.();

    if (result !== false) {
      setCooldown(local.resendCooldown);
    }
  };

  const handleBack = () => {
    if (!local.onBack) {
      return;
    }

    local.onBack();
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
              <span class="sr-only">{t("authPage.brand")}</span>
            </a>
            <h1 class="text-xl font-bold">
              {t("authPage.checkEmail.title")}
            </h1>
          </div>
          <div class="text-center">
            <p class="text-sm font-medium text-muted-foreground">
              {t("authPage.checkEmail.description")}
            </p>
          </div>
          <div class="space-y-2">
            <Button
              class="w-full"
              type="button"
              onClick={handleResend}
              disabled={Boolean(cooldown()) || local.isResending}
            >
              <Show
                when={!local.isResending}
                fallback={<Loader class="animate-spin" />}
              >
                <Show when={!cooldown()} fallback={`${cooldown()}`}>
                  {t("authPage.checkEmail.resend")}
                </Show>
              </Show>
            </Button>
            <Button
              class="w-full"
              variant={"outline"}
              type="button"
              onClick={handleBack}
            >
              {t("authPage.checkEmail.back")}
            </Button>
            <Show when={local.error}>
              {(error) => (
                <p
                  class="text-center text-sm font-medium text-destructive"
                  role="alert"
                >
                  {error()}
                </p>
              )}
            </Show>
          </div>
        </div>
      </form>
    </div>
  );
}
