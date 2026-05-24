import { LucideBadgeCheck } from "lucide-solid";
import { createResource, createSignal, For, Show } from "solid-js";
import {
  CreateInvoiceRequestDtoProvider,
  CreateInvoiceRequestDtoType,
  type GetSubscriptionPlanResponseDto,
  invoiceControllerHandleCreateInvoice,
  subscriptionPlanControllerGetSubscriptionPlans,
  SubscriptionPlanControllerGetSubscriptionPlansInterval,
} from "~/api/generated";
import { useLocale } from "~/context/Locale";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Flex } from "~/components/ui/Flex";
import { Grid } from "~/components/ui/Grid";
import { Separator } from "~/components/ui/Separator";
import { showToast } from "~/components/ui/Toast";
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from "~/components/ui/Switch";

type Plan = GetSubscriptionPlanResponseDto;

function Plans() {
  const { locale, t } = useLocale();

  const [isLoading, setIsLoading] = createSignal(false);
  const [isAnnualBilling, setIsAnnualBilling] = createSignal(false);

  const [plans] = createResource(
    () => ({
      locale: locale(),
      interval: isAnnualBilling()
        ? SubscriptionPlanControllerGetSubscriptionPlansInterval.YEAR
        : SubscriptionPlanControllerGetSubscriptionPlansInterval.MONTH,
    }),
    async (query) => {
      const response = await subscriptionPlanControllerGetSubscriptionPlans(
        {
          interval: query.interval,
          count: 1,
        },
        {
          headers: {
            "Accept-Language": query.locale,
          },
        },
      );

      return response.data.subscriptionPlans;
    },
  );

  const formatBillingInterval = (plan: Plan) => {
    const interval = plan.billingInterval.toLowerCase();

    if (plan.billingIntervalCount === 1) {
      return t(`plansPage.billingInterval.${interval}`);
    }

    return t(`plansPage.billingInterval.every.${interval}`).replace(
      "{count}",
      String(plan.billingIntervalCount),
    );
  };

  const handleCreateSubscriptionInvoice = async (plan: Plan) => {
    setIsLoading(true);

    try {
      const response = await invoiceControllerHandleCreateInvoice(
        {
          type: CreateInvoiceRequestDtoType.SUBSCRIPTION_PLAN,
          referenceId: plan.id,
          provider: CreateInvoiceRequestDtoProvider.NOWPAYMENTS,
        },
        {
          headers: {
            "Accept-Language": locale(),
          },
        },
      );

      if (!response.data.externalCheckoutUrl) {
        showToast({
          title: t("plansPage.errors.checkoutUrlMissing"),
          variant: "error",
        });

        return;
      }

      window.location.assign(response.data.externalCheckoutUrl);
    } catch {
      showToast({
        title: t("plansPage.errors.checkoutCreateFailed"),
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="w-full flex-1 flex flex-col gap-8">
      <Grid class="w-full gap-4">
        <h1 class="text-3xl font-semibold">{t("plansPage.title")}</h1>
        <Switch
          checked={isAnnualBilling()}
          onChange={setIsAnnualBilling}
          class="flex items-center space-x-2"
        >
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>{t("plansPage.annualBilling")}</SwitchLabel>
        </Switch>
      </Grid>
      <div class="flex-1">
        <Grid cols={1} colsMd={2} colsLg={3} class="min-h-full gap-4">
          <For each={plans()}>
            {(plan) => (
              <Card class="w-full flex-1">
                <CardHeader>
                  <CardTitle>{plan.name ?? plan.code}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Grid class="gap-12">
                    <Grid>
                      <Show when={plan.price}>
                        {(price) => (
                          <p class="text-5xl font-semibold tracking-tight">
                            {price().formatted}
                          </p>
                        )}
                      </Show>
                      <p class="text-xs text-muted-foreground">
                        {formatBillingInterval(plan)}
                      </p>
                    </Grid>
                    <Grid class="gap-4">
                      <p class="text-sm text-muted-foreground">
                        {plan.description ??
                          t("plansPage.descriptionFallback")}
                      </p>
                      <Button
                        size="sm"
                        disabled={isLoading()}
                        onClick={() => handleCreateSubscriptionInvoice(plan)}
                      >
                        {t("plansPage.action")}
                      </Button>
                    </Grid>
                    <Grid class="gap-6">
                      <Flex class="gap-3">
                        <Separator class="flex-1" />
                        <span class=" text-xs text-muted-foreground opacity-50">
                          {t("plansPage.features")}
                        </span>
                        <Separator class="flex-1" />
                      </Flex>
                      <ul class="space-y-4">
                        <For
                          each={plan.features
                            .sort(
                              (first, second) =>
                                first.sortOrder - second.sortOrder,
                            )}
                        >
                          {(feature) => (
                            <li class="flex items-center gap-3">
                              <LucideBadgeCheck class="size-5 shrink-0 text-muted-foreground" />
                              <span class="text-sm text-muted-foreground">
                                {feature.description ?? feature.title}
                              </span>
                            </li>
                          )}
                        </For>
                      </ul>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </For>
          <Show when={(plans()?.length ?? 0) < 1}>
            <Card class="bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--card-foreground)10%,transparent),color-mix(in_oklab,var(--card-foreground)10%,transparent)_1px,var(--card)_2px,var(--card)_15px)]" />
          </Show>
          <Show when={(plans()?.length ?? 0) < 2}>
            <Card class="hidden md:block bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--card-foreground)10%,transparent),color-mix(in_oklab,var(--card-foreground)10%,transparent)_1px,var(--card)_2px,var(--card)_15px)]" />
          </Show>
          <Show when={(plans()?.length ?? 0) < 3}>
            <Card class="hidden lg:block bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--card-foreground)10%,transparent),color-mix(in_oklab,var(--card-foreground)10%,transparent)_1px,var(--card)_2px,var(--card)_15px)]" />
          </Show>
        </Grid>
      </div>
    </div>
  );
}

export default Plans;
