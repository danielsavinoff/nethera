import { createSignal, Show } from "solid-js";
import { authControllerHandleRequestMagicLink } from "~/api/generated";
import { CheckYourEmail } from "~/components/CheckYourEmail";
import { LoginForm } from "~/components/LoginForm";
import { useLocale } from "~/context/Locale";

export default function Login() {
  const { t } = useLocale();

  const [isEmailSent, setIsEmailSent] = createSignal(false);
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const [email, setEmail] = createSignal<string>("");
  const [error, setError] = createSignal<string | null>(null);

  const requestMagicLink = async (email: string) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await authControllerHandleRequestMagicLink({ email });

      setEmail(email);
      setIsEmailSent(true);

      return true;
    } catch {
      setError(t("authPage.errors.magicLinkRequestFailed"));

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setError(null);
    setIsEmailSent(false);
  };

  return (
    <div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-card p-6 md:p-10">
      <div class="w-full max-w-xs">
        <Show
          when={!isEmailSent()}
          fallback={
            <CheckYourEmail
              resendCooldown={5}
              onBack={handleBack}
              onResend={() => requestMagicLink(email())}
              isResending={isSubmitting()}
              error={error()}
            />
          }
        >
          <LoginForm
            defaultEmail={email()}
            onContinue={requestMagicLink}
            isSubmitting={isSubmitting()}
            error={error()}
          />
        </Show>
      </div>
    </div>
  );
}
