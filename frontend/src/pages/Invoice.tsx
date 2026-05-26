import { useNavigate, useParams } from "@solidjs/router";
import type { ColumnDef } from "@tanstack/solid-table";
import axios from "axios";
import { createEffect, createMemo, createResource, Show } from "solid-js";
import {
  billingControllerHandleGetInvoice,
  billingControllerHandleGetInvoiceLines,
  type GetInvoiceLineResponseDto,
} from "~/api/generated";
import { DataTable } from "~/components/DataTable";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { Flex } from "~/components/ui/Flex";
import { Grid } from "~/components/ui/Grid";
import { showToast } from "~/components/ui/Toast";
import { useLocale } from "~/context/Locale";

type InvoiceLine = GetInvoiceLineResponseDto;

function Invoice() {
  const params = useParams();

  const navigate = useNavigate();

  const { locale, t } = useLocale();

  const invoiceId = () => params.id;

  createEffect(() => {
    if (!invoiceId()) {
      navigate("/not-found", { replace: true });
    }
  });

  const handleCopyInvoiceId = async () => {
    try {
      await navigator.clipboard.writeText(invoiceId()!);

      showToast({
        title: t("invoicePage.actions.copyInvoiceIdSuccess"),
        variant: "success",
      });
    } catch {
      showToast({
        title: t("invoicePage.actions.copyInvoiceIdError"),
        variant: "error",
      });
    }
  };

  const [lines] = createResource(
    () => ({
      id: invoiceId(),
      locale: locale(),
    }),
    async ({ id, locale: requestLocale }) => {
      if (!id) {
        return [];
      }

      try {
        const response = await billingControllerHandleGetInvoiceLines(id, {
          headers: {
            "Accept-Language": requestLocale,
          },
        });

        return response.data.lines;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          navigate("/not-found", { replace: true });

          return [];
        }

        throw error;
      }
    },
  );

  const [invoice] = createResource(
    () => ({
      id: invoiceId(),
      locale: locale(),
    }),
    async ({ id, locale: requestLocale }) => {
      if (!id) {
        return null;
      }

      try {
        const response = await billingControllerHandleGetInvoice(id, {
          headers: {
            "Accept-Language": requestLocale,
          },
        });

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          navigate("/not-found", { replace: true });

          return null;
        }

        throw error;
      }
    },
  );

  const formatPaymentMethod = (provider?: string) => {
    if (!provider) {
      return t("invoicePage.paymentMethod.unknown");
    }

    const key = `invoicePage.paymentMethod.${provider.toLowerCase()}`;
    const translated = t(key);

    return translated === key ? provider : translated;
  };

  const shouldShowPayButton = () =>
    invoice()?.status !== "paid" && Boolean(invoice()?.externalCheckoutUrl);

  const handlePay = () => {
    const checkoutUrl = invoice()?.externalCheckoutUrl;

    if (!checkoutUrl) {
      return;
    }

    window.location.assign(checkoutUrl);
  };

  const lineColumns = createMemo<ColumnDef<InvoiceLine>[]>(() => [
    {
      accessorKey: "title",
      header: t("invoicePage.lines.columns.title"),
    },
    {
      accessorKey: "amount",
      header: t("invoicePage.lines.columns.amount"),
      cell: (row) => row.row.original.amount.formatted,
    },
  ]);

  const formatStatus = (status: string) =>
    t(`invoicePage.status.${status.toLowerCase()}`);

  const getStatusVariant = (
    status: string,
  ): "success" | "warning" | "error" | "secondary" => {
    if (status === "paid") {
      return "success";
    }

    if (status === "pending") {
      return "warning";
    }

    if (status === "expired" || status === "canceled") {
      return "error";
    }

    return "secondary";
  };

  return (
    <div class="w-full flex-1 flex flex-col gap-8">
      <Grid class="w-full gap-4">
        <Flex class="min-w-0 flex-wrap justify-baseline items-center gap-2">
          <h1 class="flex min-w-0 items-baseline gap-2 text-3xl font-semibold">
            <span class="shrink-0">{t("invoicePage.title")}</span>
            <span
              role="button"
              tabindex="0"
              title={invoiceId()}
              class="block min-w-0 max-w-72 truncate text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={handleCopyInvoiceId}
            >
              #{invoiceId()}
            </span>
          </h1>

          <Show when={!invoice.loading && Boolean(invoice())}>
            <Badge variant={getStatusVariant(invoice()!.status)}>
              {formatStatus(invoice()!.status)}
            </Badge>
          </Show>
        </Flex>
      </Grid>
      <Grid class="w-full flex-1 gap-4 content-start items-start lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div class="h-fit min-w-0 flex flex-col">
          <DataTable<InvoiceLine, unknown>
            columns={lineColumns()}
            data={lines() ?? []}
            emptyMessage={t("invoicePage.lines.emptyState")}
          />
        </div>
        <Flex class="min-w-0 flex-col gap-4 w-full justify-baseline">
          <Card class="w-full h-fit">
            <CardHeader>
              <CardTitle>{t("invoicePage.billingInfo.title")}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-5">
              <div class="space-y-1 text-base">
                <p class="text-muted-foreground">
                  {t("invoicePage.billingInfo.emailAddress")}
                </p>
                <p class="font-semibold">{invoice()?.billingEmail}</p>
              </div>
            </CardContent>
          </Card>

          <Card class="w-full h-fit">
            <CardHeader>
              <CardTitle>{t("invoicePage.paymentMethod.title")}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-5">
              <div class="space-y-1 text-base">
                <p class="text-muted-foreground">
                  {t("invoicePage.paymentMethod.label")}
                </p>
                <p class="font-semibold">
                  {formatPaymentMethod(invoice()?.provider)}
                </p>
              </div>
            </CardContent>
            <Show when={shouldShowPayButton()}>
              <CardFooter>
                <Button class="w-full" size={"sm"} onClick={handlePay}>
                  {t("invoicePage.paymentMethod.pay")}
                </Button>
              </CardFooter>
            </Show>
          </Card>
        </Flex>
      </Grid>
    </div>
  );
}

export default Invoice;
