import { A } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Grid } from "~/components/ui/Grid";
import { useLocale } from "~/context/Locale";

function NotFound() {
  const { t } = useLocale();

  return (
    <div class="w-full flex-1 flex flex-col gap-8">
      <Grid class="w-full gap-4">
        <h1 class="text-3xl font-semibold">{t("notFoundPage.title")}</h1>
        <p class="max-w-prose text-muted-foreground">
          {t("notFoundPage.description")}
        </p>
      </Grid>
      <Button as={A} href="/subscription" class="w-fit">
        {t("notFoundPage.actions.home")}
      </Button>
    </div>
  );
}

export default NotFound;
