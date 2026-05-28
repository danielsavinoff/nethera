import { LucideBadgeCheck } from "lucide-solid";
import { createResource, createSignal, For, Show } from "solid-js";
import {
  billingControllerHandleCreateInvoice,
  billingControllerHandleGetProviders,
  CreateInvoiceRequestDtoProvider,
  CreateInvoiceRequestDtoType,
  type GetBillingProvidersResponseDtoProvidersItem,
  type GetSubscriptionPlanResponseDto,
  subscriptionPlanControllerGetSubscriptionPlans,
  SubscriptionPlanControllerGetSubscriptionPlansInterval,
} from "~/api/generated";
import { useLocale } from "~/context/Locale";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";
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
type BillingProvider = GetBillingProvidersResponseDtoProvidersItem;

function Plans() {
  const { locale, t } = useLocale();

  const [isInvoiceCreating, setIsInvoiceCreating] = createSignal(false);
  const [isAnnualBilling, setIsAnnualBilling] = createSignal(false);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = createSignal(false);
  const [selectedPlan, setSelectedPlan] = createSignal<Plan>();

  const [plans] = createResource(
    () => ({
      locale: locale(),
      interval: isAnnualBilling()
        ? SubscriptionPlanControllerGetSubscriptionPlansInterval.YEAR
        : SubscriptionPlanControllerGetSubscriptionPlansInterval.MONTH,
    }),
    async (query) => {
      const response = await subscriptionPlanControllerGetSubscriptionPlans({
        interval: query.interval,
        count: 1,
      });

      return response.data.subscriptionPlans;
    },
  );

  const [providers] = createResource(
    () => (isProviderDialogOpen() ? locale() : undefined),
    async () => {
      const response = await billingControllerHandleGetProviders();

      return response.data.providers;
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

  const formatBillingProvider = (provider: BillingProvider) => {
    const key = `payments.${provider.toLowerCase()}`;

    const label = t(key);

    return label === key ? provider : label;
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsProviderDialogOpen(true);
  };

  const handleCreateSubscriptionInvoice = async (provider: BillingProvider) => {
    const plan = selectedPlan();

    if (!plan) {
      return;
    }

    setIsInvoiceCreating(true);

    try {
      const response = await billingControllerHandleCreateInvoice({
        type: CreateInvoiceRequestDtoType.SUBSCRIPTION_PLAN,
        referenceId: plan.id,
        provider: provider as CreateInvoiceRequestDtoProvider,
      });

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
      setIsInvoiceCreating(false);
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
                        {plan.description ?? t("plansPage.descriptionFallback")}
                      </p>
                      <Button
                        size="sm"
                        disabled={isInvoiceCreating()}
                        onClick={() => handleSelectPlan(plan)}
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
                          each={plan.features.sort(
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
      <Dialog
        open={isProviderDialogOpen()}
        onOpenChange={setIsProviderDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("plansPage.paymentProviderDialog.title")}
            </DialogTitle>
          </DialogHeader>
          <Grid class="gap-2">
            <Show when={providers.loading}>
              <p class="text-sm text-muted-foreground">
                {t("plansPage.paymentProviderDialog.loading")}
              </p>
            </Show>
            <Show when={!providers.loading && (providers()?.length ?? 0) < 1}>
              <p class="text-sm text-muted-foreground">
                {t("plansPage.paymentProviderDialog.empty")}
              </p>
            </Show>
            <For each={providers() ?? []}>
              {(provider) => (
                <Button
                  variant="outline"
                  class="w-full justify-start"
                  disabled={isInvoiceCreating()}
                  onClick={() => handleCreateSubscriptionInvoice(provider)}
                >
                  {formatBillingProvider(provider)}
                </Button>
              )}
            </For>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Plans;
