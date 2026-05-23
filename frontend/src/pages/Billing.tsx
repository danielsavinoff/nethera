import { Grid } from "~/components/ui/Grid";
import type { ColumnDef } from "@tanstack/solid-table";
import { DataTable } from "~/components/DataTable";
import { Badge } from "~/components/ui/Badge";
import {
  type GetInvoiceResponseDto,
  invoiceControllerHandleGetInvoices,
} from "~/api/generated";
import { createMemo, createResource } from "solid-js";
import { useLocale } from "~/context/Locale";

import { Button } from "~/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";
import { Ellipsis } from "lucide-solid";
import { showToast } from "~/components/ui/Toast";

type Invoice = GetInvoiceResponseDto;

function Billing() {
  const { locale, t } = useLocale();

  const [invoices] = createResource(locale, async (requestLocale) => {
    const response = await invoiceControllerHandleGetInvoices({
      headers: {
        "Accept-Language": requestLocale,
      },
    });

    return response.data.invoices;
  });

  const formatDate = (value?: string) => {
    if (!value) {
      return t("billingPage.unknownDueDate");
    }

    return new Intl.DateTimeFormat(locale(), {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  const formatStatus = (status: string) =>
    t(`billingPage.status.${status.toLowerCase()}`);

  const handleCopyInvoiceId = async (invoiceId: string) => {
    try {
      await navigator.clipboard.writeText(invoiceId);

      showToast({
        title: t("billingPage.actions.copyInvoiceIdSuccess"),
        variant: "success",
      });
    } catch {
      showToast({
        title: t("billingPage.actions.copyInvoiceIdError"),
        variant: "error",
      });
    }
  };

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

  const columns = createMemo<ColumnDef<Invoice>[]>(() => [
    {
      accessorKey: "status",
      header: t("billingPage.columns.status"),
      cell: (row) => {
        const value = String(row.cell.getValue());

        return (
          <Badge variant={getStatusVariant(value)}>{formatStatus(value)}</Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("billingPage.columns.issuedAt"),
      cell: (row) => formatDate(String(row.cell.getValue())),
    },
    {
      accessorKey: "expiresAt",
      header: t("billingPage.columns.dueAt"),
      cell: (row) => formatDate(row.cell.getValue() as string | undefined),
    },
    {
      accessorKey: "total.formatted",
      header: t("billingPage.columns.totalAmount"),
      cell: (row) => row.row.original.total.formatted,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: (props) => {
        return (
          <DropdownMenu placement="bottom-end">
            <DropdownMenuTrigger
              as={Button<"button">}
              variant="ghost"
              class="size-8 p-0"
            >
              <span class="sr-only">{t("billingPage.actions.openMenu")}</span>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent class="min-w-3xs">
              <DropdownMenuLabel>
                {t("billingPage.actions.label")}
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleCopyInvoiceId(props.row.original.id)}
              >
                {t("billingPage.actions.copyInvoiceId")}
              </DropdownMenuItem>
              {props.row.original.status === "pending" &&
                props.row.original.externalCheckoutUrl && (
                  <DropdownMenuItem
                    onClick={() =>
                      window.location.assign(
                        props.row.original.externalCheckoutUrl,
                      )
                    }
                  >
                    {t("billingPage.actions.payInvoice")}
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ]);

  return (
    <div class="w-full flex-1 flex flex-col gap-8">
      <Grid class="w-full gap-4">
        <h1 class="text-3xl font-semibold">{t("billingPage.title")}</h1>
      </Grid>
      <div class="flex-1">
        <DataTable<Invoice, unknown>
          columns={columns()}
          data={invoices() ?? []}
          emptyMessage={t("billingPage.emptyState")}
        />
      </div>
    </div>
  );
}

export default Billing;
