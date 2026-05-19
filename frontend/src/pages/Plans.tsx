import { LucideBadgeCheck } from "lucide-solid";
import { For, Show } from "solid-js";
import { useLocale } from "~/context/Locale";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Flex } from "~/components/ui/Flex";
import { Grid } from "~/components/ui/Grid";
import { Separator } from "~/components/ui/Separator";
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from "~/components/ui/Switch";

function Plans() {
  const plans = ["Free"];

  const { t } = useLocale();

  return (
    <div class="w-full flex-1 flex flex-col gap-8">
      <Grid class="w-full gap-4">
        <h1 class="text-3xl font-semibold">{t("plansPage.title")}</h1>
        <Switch class="flex items-center space-x-2">
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>{t("plansPage.annualBilling")}</SwitchLabel>
        </Switch>
      </Grid>
      <div class="flex-1">
        <Grid cols={1} colsMd={2} colsLg={3} class="gap-4">
          <For each={plans}>
            {(plan, i) => (
              <Card class="w-full flex-1">
                <CardHeader>
                  <CardTitle>{plan}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Grid class="gap-12">
                    <Grid>
                      <p class="text-5xl font-semibold tracking-tight">
                        ${20 * (i() + 1)}
                      </p>
                      <p class="text-xs text-muted-foreground">per month</p>
                    </Grid>
                    <Grid class="gap-4">
                      <p class="text-sm text-muted-foreground">
                        Ideal for individuals getting started. No credit card
                        required.
                      </p>
                      <Button size="sm">Get started</Button>
                    </Grid>
                    <Grid class="gap-6">
                      <Flex class="gap-3">
                        <Separator class="flex-1" />
                        <span class=" text-xs text-muted-foreground opacity-50">
                          FEATURES
                        </span>
                        <Separator class="flex-1" />
                      </Flex>
                      <ul class="space-y-4">
                        <li class="flex items-center gap-3">
                          <LucideBadgeCheck class="size-5 shrink-0 text-muted-foreground" />
                          <span class="text-sm text-muted-foreground">
                            Up to 5 components
                          </span>
                        </li>
                        <li class="flex items-center gap-3">
                          <LucideBadgeCheck class="size-5 shrink-0 text-muted-foreground" />
                          <span class="text-sm text-muted-foreground">
                            Up to 5 components
                          </span>
                        </li>
                      </ul>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </For>
          <Show when={plans.length < 3}>
            <Card class="hidden md:block bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--card-foreground)10%,transparent),color-mix(in_oklab,var(--card-foreground)10%,transparent)_1px,var(--card)_2px,var(--card)_15px)]" />
            <Card class="hidden lg:block bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--card-foreground)10%,transparent),color-mix(in_oklab,var(--card-foreground)10%,transparent)_1px,var(--card)_2px,var(--card)_15px)]" />
          </Show>
        </Grid>
      </div>
    </div>
  );
}

export default Plans;
