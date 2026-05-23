import { Grid } from "~/components/ui/Grid";
import type { ColumnDef } from "@tanstack/solid-table";
import { DataTable } from "~/components/DataTable";
import { Badge } from "~/components/ui/Badge";
import {
  type GetPaymentResponseDto,
  paymentControllerGetPayments,
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

type Payment = GetPaymentResponseDto;

function Billing() {
  const { locale, t } = useLocale();

  const [payments] = createResource(async () => {
    const response = await paymentControllerGetPayments();

    return response.data.payments;
  });

  const formatMoney = (amountMinor: number, currency: string) => {
    try {
      const amount = amountMinor / 100;

      return new Intl.NumberFormat(locale(), {
        style: "currency",
        currency,
      }).format(amount);
    } catch {
      return `${amountMinor} ${currency.toUpperCase()}`;
    }
  };

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

  const handleCopyPaymentId = async (paymentId: string) => {
    try {
      await navigator.clipboard.writeText(paymentId);

      showToast({
        title: t("billingPage.actions.copyPaymentIdSuccess"),
        variant: "success",
      });
    } catch {
      showToast({
        title: t("billingPage.actions.copyPaymentIdError"),
        variant: "error",
      });
    }
  };

  const getStatusVariant = (
    status: string,
  ): "success" | "warning" | "error" | "secondary" => {
    if (status === "PAID") {
      return "success";
    }

    if (status === "OPEN" || status === "DRAFT") {
      return "warning";
    }

    if (status === "FAILED" || status === "VOID") {
      return "error";
    }

    return "secondary";
  };

  const columns = createMemo<ColumnDef<Payment>[]>(() => [
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
      accessorKey: "issuedAt",
      header: t("billingPage.columns.issuedAt"),
      cell: (row) => formatDate(String(row.cell.getValue())),
    },
    {
      accessorKey: "dueAt",
      header: t("billingPage.columns.dueAt"),
      cell: (row) => formatDate(row.cell.getValue() as string | undefined),
    },
    {
      accessorKey: "amountDue",
      header: t("billingPage.columns.amountDue"),
      cell: (row) => {
        const payment = row.row.original;

        return formatMoney(payment.amountMinor, payment.currency);
      },
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
              <span class="sr-only">
                {t("billingPage.actions.openMenu")}
              </span>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent class="min-w-3xs">
              <DropdownMenuLabel>
                {t("billingPage.actions.label")}
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleCopyPaymentId(props.row.original.id)}
              >
                {t("billingPage.actions.copyPaymentId")}
              </DropdownMenuItem>
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
        <DataTable<Payment, unknown>
          columns={columns()}
          data={payments() ?? []}
          emptyMessage={t("billingPage.emptyState")}
        />
      </div>
    </div>
  );
}

export default Billing;
