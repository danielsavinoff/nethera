import { A } from "@solidjs/router";
import type { ColumnDef } from "@tanstack/solid-table";
import { Ellipsis } from "lucide-solid";
import { createMemo, createResource } from "solid-js";
import {
  billingControllerHandleGetInvoices,
  type GetInvoiceResponseDto,
} from "~/api/generated";
import { DataTable } from "~/components/DataTable";
import { Button } from "~/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";
import { Grid } from "~/components/ui/Grid";
import { showToast } from "~/components/ui/Toast";
import { useLocale } from "~/context/Locale";

type Invoice = GetInvoiceResponseDto;

function Invoices() {
  const { locale, t } = useLocale();

  const [invoices] = createResource(locale, async (requestLocale) => {
    const response = await billingControllerHandleGetInvoices({
      headers: {
        "Accept-Language": requestLocale,
      },
    });

    return response.data.invoices;
  });

  const formatDate = (value?: string) => {
    if (!value) {
      return t("invoicesPage.unknownDueDate");
    }

    return new Intl.DateTimeFormat(locale(), {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  const handleCopyInvoiceId = async (invoiceId: string) => {
    try {
      await navigator.clipboard.writeText(invoiceId);

      showToast({
        title: t("invoicesPage.actions.copyInvoiceIdSuccess"),
        variant: "success",
      });
    } catch {
      showToast({
        title: t("invoicesPage.actions.copyInvoiceIdError"),
        variant: "error",
      });
    }
  };

  const columns = createMemo<ColumnDef<Invoice>[]>(() => [
    {
      accessorKey: "status",
      header: t("invoicesPage.columns.status"),
      cell: (row) => {
        const value = String(row.cell.getValue());

        return t(`invoicesPage.status.${value}`);
      },
    },
    {
      accessorKey: "createdAt",
      header: t("invoicesPage.columns.issuedAt"),
      cell: (row) => formatDate(String(row.cell.getValue())),
    },
    {
      accessorKey: "expiresAt",
      header: t("invoicesPage.columns.dueAt"),
      cell: (row) => formatDate(row.cell.getValue() as string | undefined),
    },
    {
      accessorKey: "total.formatted",
      header: t("invoicesPage.columns.totalAmount"),
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
              <span class="sr-only">{t("invoicesPage.actions.openMenu")}</span>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent class="min-w-3xs">
              <DropdownMenuLabel>
                {t("invoicesPage.actions.label")}
              </DropdownMenuLabel>
              <DropdownMenuItem
                as={A}
                href={`/invoices/${props.row.original.id}`}
              >
                {t("invoicesPage.actions.viewInvoice")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCopyInvoiceId(props.row.original.id)}
              >
                {t("invoicesPage.actions.copyInvoiceId")}
              </DropdownMenuItem>
              {props.row.original.status === "pending" &&
                props.row.original.externalCheckoutUrl && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        window.location.assign(
                          props.row.original.externalCheckoutUrl,
                        )
                      }
                    >
                      {t("invoicesPage.actions.payInvoice")}
                    </DropdownMenuItem>
                  </>
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
        <h1 class="text-3xl font-semibold">{t("invoicesPage.title")}</h1>
      </Grid>
      <div class="flex-1">
        <DataTable<Invoice, unknown>
          columns={columns()}
          data={invoices() ?? []}
          emptyMessage={t("invoicesPage.emptyState")}
        />
      </div>
    </div>
  );
}

export default Invoices;
