import { A } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Flex } from "~/components/ui/Flex";
import { useLocale } from "~/context/Locale";

function NotFound() {
  const { t } = useLocale();

  return (
    <Flex class="w-full h-dvh flex-col p-6 md:p-10">
      <style>
        {`
          @keyframes not-found-circle-drift {
            0% {
              transform: translate3d(-52%, -45%, 0);
            }

            18% {
              transform: translate3d(-18%, -78%, 0);
            }

            41% {
              transform: translate3d(42%, -30%, 0);
            }

            63% {
              transform: translate3d(16%, 22%, 0);
            }

            82% {
              transform: translate3d(-64%, 8%, 0);
            }

            100% {
              transform: translate3d(-52%, -45%, 0);
            }
          }
        `}
      </style>
      <Flex class="relative flex-1 justify-center items-center overflow-hidden">
        <span
          aria-hidden="true"
          class="pointer-events-none absolute left-1/2 top-1/2 z-10 size-28 rounded-full bg-background dark:bg-primary mix-blend-difference md:size-40"
          style={{
            animation: "not-found-circle-drift 8s ease-in-out infinite",
          }}
        />
        <p class="text-9xl font-bold">404</p>
      </Flex>
      <div class="text-center">
        <h1 class="mb-1.5 text-2xl font-semibold">{t("notFoundPage.title")}</h1>
        <p class="mb-5">{t("notFoundPage.description")}</p>
        <Button as={A} href="/" class="w-fit" size={"sm"}>
          {t("notFoundPage.actions.home")}
        </Button>
      </div>
    </Flex>
  );
}

export default NotFound;
