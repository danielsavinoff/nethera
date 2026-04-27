import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { GalleryVerticalEnd } from "lucide-solid";

import { TextField, TextFieldInput, TextFieldLabel } from "./ui/TextField";
import { Button } from "./ui/Button";
import { A } from "@solidjs/router";

type LoginFormProps = JSX.HTMLAttributes<HTMLDivElement> & {
  onContinue?: (email: string) => unknown;
};

export function LoginForm(props: LoginFormProps) {
  const [local, others] = splitProps(props, ["class", "onContinue"]);

  const handleContinue = (e: SubmitEvent) => {
    e.preventDefault();

    if (!local.onContinue) {
      return;
    }

    const form = e.target as HTMLFormElement;

    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;

    local.onContinue(email);
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
              placeholder="johndoe@example.com"
              class="h-13"
            />
          </TextField>
          <Button class="w-full" size={"lg"} type="submit">
            Continue
          </Button>
        </div>
      </form>
      <div class="px-6 text-center">
        <p class="text-sm text-muted-foreground whitespace-pre-wrap [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary [&>a]:transition-colors">
          By clicking continue, you agree to&nbsp;
          <A href="/terms">Terms of Service</A>
          &nbsp;and&nbsp;
          <A href="/privacy">Privacy Policy</A>.
        </p>
      </div>
    </div>
  );
}
