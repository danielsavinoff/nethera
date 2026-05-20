import { LucideBadgeCheck } from "lucide-solid";
import { createResource, createSignal, For, Show } from "solid-js";
import {
  CreateSubscriptionInvoiceRequestDtoProvider,
  type GetPlanFeatureResponseDto,
  type GetPlanResponseDto,
  planControllerHandleGetPlans,
  subscriptionInvoiceControllerHandleCreateSubscriptionInvoice,
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

type Plan = GetPlanResponseDto;
type PlanFeature = GetPlanFeatureResponseDto;

function Plans() {
  const { locale, t } = useLocale();

  const [isLoading, setIsLoading] = createSignal(false);

  const [plans] = createResource(async () => {
    const response = await planControllerHandleGetPlans();

    return response.data.plans;
  });

  const getPlanTranslation = (plan: Plan) =>
    plan.translations.find(
      (translation) => translation.language === locale(),
    ) ?? plan.translations[0];

  const getFeatureTranslation = (feature: PlanFeature) =>
    feature.translations.find(
      (translation) => translation.language === locale(),
    ) ?? feature.translations[0];

  const formatMoney = (amount: string, currency: string) => {
    try {
      return new Intl.NumberFormat(locale(), {
        style: "currency",
        currency,
        maximumFractionDigits: Number(amount) % 1 === 0 ? 0 : 2,
      }).format(Number(amount));
    } catch {
      return `${amount} ${currency.toUpperCase()}`;
    }
  };

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
      const response =
        await subscriptionInvoiceControllerHandleCreateSubscriptionInvoice({
          planId: plan.id,
          provider: CreateSubscriptionInvoiceRequestDtoProvider.NOWPAYMENTS,
        });

      if (!response.data.checkoutUrl) {
        showToast({
          title: t("plansPage.errors.checkoutUrlMissing"),
          variant: "error",
        });

        return;
      }

      window.location.assign(response.data.checkoutUrl);
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
        <Switch class="flex items-center space-x-2">
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>{t("plansPage.annualBilling")}</SwitchLabel>
        </Switch>
      </Grid>
      <div class="flex-1">
        <Grid cols={1} colsMd={2} colsLg={3} class="gap-4">
          <For each={plans()}>
            {(plan) => (
              <Card class="w-full flex-1">
                <CardHeader>
                  <CardTitle>
                    {getPlanTranslation(plan)?.name ?? plan.code}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Grid class="gap-12">
                    <Grid>
                      <p class="text-5xl font-semibold tracking-tight">
                        {formatMoney(plan.priceAmount, plan.priceCurrency)}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        {formatBillingInterval(plan)}
                      </p>
                    </Grid>
                    <Grid class="gap-4">
                      <p class="text-sm text-muted-foreground">
                        {getPlanTranslation(plan)?.description ??
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
                            .filter((feature) => feature.active)
                            .sort(
                              (first, second) =>
                                first.sortOrder - second.sortOrder,
                            )}
                        >
                          {(feature) => (
                            <li class="flex items-center gap-3">
                              <LucideBadgeCheck class="size-5 shrink-0 text-muted-foreground" />
                              <span class="text-sm text-muted-foreground">
                                {getFeatureTranslation(feature)?.description ??
                                  feature.code}
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
