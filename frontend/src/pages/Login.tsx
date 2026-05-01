import { createSignal, Show } from "solid-js";
import { CheckYourEmail } from "~/components/CheckYourEmail";
import { LoginForm } from "~/components/LoginForm";

export default function Login() {
  const [isEmailSent, setIsEmailSent] = createSignal(false);

  return (
    <div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-card p-6 md:p-10">
      <div class="w-full max-w-xs">
        <Show
          when={!isEmailSent()}
          fallback={
            <CheckYourEmail
              resendCooldown={5}
              onBack={() => setIsEmailSent(false)}
            />
          }
        >
          <LoginForm onContinue={() => setIsEmailSent(true)} />
        </Show>
      </div>
    </div>
  );
}
