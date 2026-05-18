import type { JSX } from "solid-js";
import { Show, splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { GalleryVerticalEnd, Loader } from "lucide-solid";

import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from "./ui/TextField";
import { Button } from "./ui/Button";
import { A } from "@solidjs/router";

type LoginFormProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultEmail?: string;
  onContinue?: (email: string) => unknown;
  isSubmitting?: boolean;
  error?: string | null;
};

export function LoginForm(props: LoginFormProps) {
  const [local, others] = splitProps(props, [
    "class",
    "onContinue",
    "error",
    "isSubmitting",
    "defaultEmail",
  ]);

  const handleContinue = (e: SubmitEvent) => {
    e.preventDefault();

    if (!local.onContinue) {
      return;
    }

    const form = e.target as HTMLFormElement;

    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;

    local.onContinue(email.trim());
  };

  return (
    <div class={cn("flex flex-col gap-6", local.class)} {...others}>
      <form onSubmit={handleContinue}>
        <div class="flex flex-col gap-7">
          <div class="flex flex-col items-center gap-2 text-center">
            <a href="#" class="flex flex-col items-center gap-2 font-medium">
              <div class="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd class="size-6" />
              </div>
              <span class="sr-only">Acme Inc.</span>
            </a>
            <h1 class="text-xl font-bold">Welcome to Acme Inc.</h1>
          </div>
          <TextField class="grid w-full items-center gap-1.5">
            <TextFieldLabel for="email">Email</TextFieldLabel>
            <TextFieldInput
              type="email"
              id="email"
              name="email"
              placeholder="johndoe@example.com"
              value={local.defaultEmail}
              class="h-13"
              required
              disabled={local.isSubmitting}
              aria-invalid={Boolean(local.error)}
            />
            <Show when={local.error}>
              {(error) => (
                <TextFieldErrorMessage>{error()}</TextFieldErrorMessage>
              )}
            </Show>
          </TextField>
          <Button type="submit" disabled={local.isSubmitting}>
            <Show
              when={!local.isSubmitting}
              fallback={<Loader class="animate-spin" />}
            >
              Continue
            </Show>
          </Button>
        </div>
      </form>
      <div class="px-6 text-center">
        <p class="text-xs  text-muted-foreground whitespace-pre-wrap [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary [&>a]:transition-colors [&>a]:decoration-1">
          By clicking continue, you agree to&nbsp;
          <A href="/terms">Terms of Service</A>
          &nbsp;and&nbsp;
          <A href="/privacy">Privacy Policy</A>.
        </p>
      </div>
    </div>
  );
}
