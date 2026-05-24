import { A } from "@solidjs/router";
import axios from "axios";
import { CircleQuestionMark, PlusIcon } from "lucide-solid";
import { createMemo, createResource, createSignal, Show } from "solid-js";
import {
  ExtendSubscriptionRequestDtoProvider,
  subscriptionControllerHandleCancelCurrentSubscription,
  subscriptionControllerHandleExtendCurrentSubscription,
  subscriptionControllerHandleGetCurrentSubscription,
  vpnSubscriptionControllerHandleGetCurrentVpnSubscription,
  vpnSubscriptionControllerHandleGetCurrentVpnSubscriptionUsage,
} from "~/api/generated";
import { useLocale } from "~/context/Locale";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { BarChart } from "~/components/ui/Charts";
import { Col, Grid } from "~/components/ui/Grid";
import { TextField, TextFieldInput } from "~/components/ui/TextField";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/Tooltip";
import { Skeleton } from "~/components/ui/Skeleton";
import { showToast } from "~/components/ui/Toast";

function Subscription() {
  const { locale, t } = useLocale();

  const [isCanceling, setIsCanceling] = createSignal(false);
  const [isExtending, setIsExtending] = createSignal(false);

  const [currentSubscription, currentSubscriptionActions] = createResource(
    locale,
    async (requestLocale) => {
      try {
        const response =
          await subscriptionControllerHandleGetCurrentSubscription({
            headers: {
              "Accept-Language": requestLocale,
            },
          });

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },
  );

  const [vpnSubscription, vpnSubscriptionActions] = createResource(
    () => currentSubscription()?.id,
    async () => {
      try {
        const response =
          await vpnSubscriptionControllerHandleGetCurrentVpnSubscription();

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },
  );

  const [vpnUsage, vpnUsageActions] = createResource(
    () => currentSubscription()?.id,
    async (subscriptionId) => {
      if (!subscriptionId) {
        return null;
      }

      try {
        const response =
          await vpnSubscriptionControllerHandleGetCurrentVpnSubscriptionUsage();

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },
  );

  const hasSubscription = () => Boolean(currentSubscription());

  const getSubscriptionValidUntil = () => currentSubscription()?.expiresAt;

  const getSubscriptionUrl = () => vpnSubscription()?.subscriptionUrl!;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getSubscriptionUrl());

      showToast({
        title: t("subscriptionPage.linkCard.copySuccess"),
        variant: "success",
      });
    } catch {
      showToast({
        title: t("subscriptionPage.linkCard.copyError"),
        variant: "error",
      });
    }
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);

    try {
      await subscriptionControllerHandleCancelCurrentSubscription();

      currentSubscriptionActions.mutate(null);
      vpnSubscriptionActions.mutate(null);
      vpnUsageActions.mutate(null);

      showToast({
        title: t("subscriptionPage.cancelDialog.success"),
        variant: "success",
      });
    } catch {
      showToast({
        title: t("subscriptionPage.cancelDialog.error"),
        variant: "error",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const handleExtendSubscription = async () => {
    setIsExtending(true);

    try {
      const response =
        await subscriptionControllerHandleExtendCurrentSubscription(
          {
            provider: ExtendSubscriptionRequestDtoProvider.NOWPAYMENTS,
          },
          {
            headers: {
              "Accept-Language": locale(),
            },
          },
        );

      if (!response.data.externalCheckoutUrl) {
        showToast({
          title: t("subscriptionPage.extend.errors.checkoutUrlMissing"),
          variant: "error",
        });

        return;
      }

      window.location.assign(response.data.externalCheckoutUrl);
    } catch {
      showToast({
        title: t("subscriptionPage.extend.errors.checkoutCreateFailed"),
        variant: "error",
      });
    } finally {
      setIsExtending(false);
    }
  };

  const formatSubscriptionValidity = () => {
    const validUntil = getSubscriptionValidUntil();

    if (!validUntil) {
      return t("subscriptionPage.validCard.unlimited");
    }

    const date = new Intl.DateTimeFormat(locale(), {
      day: "numeric",
      month: "long",
    }).format(new Date(validUntil));

    return t("subscriptionPage.validCard.until").replace("{date}", date);
  };

  const formatChartDate = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);

    return new Intl.DateTimeFormat(locale(), {
      day: "numeric",
      month: "short",
    }).format(new Date(year, month - 1, day));
  };

  const chartData = createMemo(() => {
    const entries = Object.entries(vpnUsage()?.usage ?? {}).sort(
      ([left], [right]) => left.localeCompare(right),
    );

    return {
      labels: entries.map(([date]) => formatChartDate(date)),
      datasets: [
        {
          label: t("subscriptionPage.trafficCard.datasetLabel"),
          data: entries.map(([, usage]) => usage),
          backgroundColor: "var(--color-chart-3)",
          borderColor: "var(--color-chart-3)",
        },
      ],
    };
  });

  return (
    <>
      <Grid class="w-full gap-4">
        <h1 class="text-3xl font-semibold">{t("subscriptionPage.title")}</h1>
      </Grid>
      <Show
        when={hasSubscription()}
        fallback={
          <Card class="w-full flex-1 flex justify-center items-center">
            <CardContent>
              <div class="gap-7 flex flex-col items-center text-center">
                <div class="gap-1 flex flex-col">
                  <h2 class="text-xl font-bold">
                    {t("subscriptionPage.emptyState.title")}
                  </h2>
                  <p class="text-sm font-medium text-muted-foreground">
                    {t("subscriptionPage.emptyState.description")}
                  </p>
                </div>
                <A href="/plans">
                  <Button>{t("subscriptionPage.emptyState.action")}</Button>
                </A>
              </div>
            </CardContent>
          </Card>
        }
      >
        <Grid
          cols={4}
          class="w-full flex-1 min-h-0 gap-4 overflow-hidden grid-rows-[fit_1fr]"
        >
          <Col span={2}>
            <Card class="h-full flex flex-col">
              <CardHeader class="flex-row justify-between items-center space-y-0">
                <CardTitle>{t("subscriptionPage.linkCard.title")}</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <CircleQuestionMark class="text-muted-foreground size-4" />
                  </TooltipTrigger>
                  <TooltipContent class="max-w-2xs">
                    <p>{t("subscriptionPage.linkCard.tooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent class="flex-1 flex items-center">
                <TextField class="grid w-full items-center gap-1.5">
                  <TextFieldInput
                    type="url"
                    value={getSubscriptionUrl()}
                    onClick={handleCopy}
                    class="cursor-copy select-none"
                    readonly
                  />
                </TextField>
              </CardContent>
              <CardFooter class="gap-4">
                <Button variant="default" class="w-full">
                  <PlusIcon />
                  {t("subscriptionPage.linkCard.addSubscription")}
                </Button>
                <Button
                  variant="secondary"
                  class="w-full"
                  disabled={!getSubscriptionUrl()}
                  onClick={handleCopy}
                >
                  {t("subscriptionPage.linkCard.copyUrl")}
                </Button>
              </CardFooter>
            </Card>
          </Col>

          <Col>
            <Card class="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{t("subscriptionPage.planCard.title")}</CardTitle>
              </CardHeader>
              <CardContent class="flex-1 flex items-center">
                <p class="text-2xl font-semibold tracking-tight">
                  <Show
                    when={!currentSubscription.loading}
                    fallback={<Skeleton height={16} width={192} radius={10} />}
                  >
                    {currentSubscription()?.subscriptionPlan?.name}
                  </Show>
                </p>
              </CardContent>
              <CardFooter class="gap-4">
                <Dialog>
                  <DialogTrigger as={Button} variant="outline" class="w-full">
                    {t("subscriptionPage.planCard.action")}
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {t("subscriptionPage.cancelDialog.title")}
                      </DialogTitle>
                      <DialogDescription>
                        {t("subscriptionPage.cancelDialog.description")}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose as={Button} variant="outline">
                        {t("subscriptionPage.cancelDialog.cancel")}
                      </DialogClose>
                      <Button
                        variant="destructive"
                        disabled={isCanceling()}
                        onClick={handleCancelSubscription}
                      >
                        {t("subscriptionPage.cancelDialog.continue")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </Col>
          <Col>
            <Card class="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{t("subscriptionPage.validCard.title")}</CardTitle>
              </CardHeader>
              <CardContent class="flex-1 flex items-center">
                <p class="text-2xl font-semibold tracking-tight">
                  <Show
                    when={!currentSubscription.loading}
                    fallback={<Skeleton height={16} width={192} radius={10} />}
                  >
                    {formatSubscriptionValidity()}
                  </Show>
                </p>
              </CardContent>
              <CardFooter class="gap-4">
                <Button
                  variant="outline"
                  class="w-full"
                  disabled={!getSubscriptionValidUntil() || isExtending()}
                  onClick={handleExtendSubscription}
                >
                  {t("subscriptionPage.validCard.action")}
                </Button>
              </CardFooter>
            </Card>
          </Col>

          <Col span={4} class="h-full min-h-0">
            <Card class="h-full min-h-0 flex flex-col">
              <CardHeader>
                <CardTitle>{t("subscriptionPage.trafficCard.title")}</CardTitle>
                <CardDescription>
                  {t("subscriptionPage.trafficCard.description")}
                </CardDescription>
              </CardHeader>
              <CardContent class="flex flex-1 min-h-0 overflow-hidden">
                <div class="h-full min-h-0 w-full">
                  <BarChart data={chartData()} />
                </div>
              </CardContent>
            </Card>
          </Col>
        </Grid>
      </Show>
    </>
  );
}

export default Subscription;
