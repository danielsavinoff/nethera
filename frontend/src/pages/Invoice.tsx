import { useNavigate, useParams } from "@solidjs/router";
import type { ColumnDef } from "@tanstack/solid-table";
import axios from "axios";
import { createEffect, createMemo, createResource } from "solid-js";
import {
  type GetInvoiceLineResponseDto,
  invoiceControllerHandleGetInvoiceLines,
} from "~/api/generated";
import { DataTable } from "~/components/DataTable";
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
        const response = await invoiceControllerHandleGetInvoiceLines(id, {
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

  return (
    <div class="w-full flex-1 flex flex-col gap-8">
      <Grid class="w-full gap-4">
        <h1 class="flex gap-2 min-w-0 items-baseline text-3xl font-semibold">
          <span>{t("invoicePage.title")}</span>
          <button
            type="button"
            class="min-w-0 max-w-60 truncate text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={handleCopyInvoiceId}
          >
            #{invoiceId()}
          </button>
        </h1>
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
              <CardTitle>Shipping & Billing info</CardTitle>
            </CardHeader>
            <CardContent class="space-y-5">
              <div class="space-y-1 text-base">
                <p class="text-muted-foreground">Email Address</p>
                <p class="font-semibold">christine@gmail.com</p>
              </div>
            </CardContent>
          </Card>

          <Card class="w-full h-fit">
            <CardHeader>
              <CardTitle>Payment method</CardTitle>
            </CardHeader>
            <CardContent class="space-y-5">
              <div class="space-y-1 text-base">
                <p class="text-muted-foreground">Payment</p>
                <p class="font-semibold">NOWPayments</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button class="w-full" size={"sm"}>
                Pay
              </Button>
            </CardFooter>
          </Card>
        </Flex>
      </Grid>
    </div>
  );
}

export default Invoice;
