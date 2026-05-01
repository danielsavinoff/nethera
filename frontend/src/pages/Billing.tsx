import { useLocale } from "~/context/Locale";

import { Grid } from "~/components/ui/Grid";
import type { ColumnDef } from "@tanstack/solid-table";
import { DataTable } from "~/components/DataTable";
import { Badge } from "~/components/ui/Badge";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  date: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => {
      const value = String(row.cell.getValue());

      return (
        <Badge variant={"error"}>
          {value[0].toUpperCase() + value.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Created at",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

function Billing() {
  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      date: new Date().toUTCString(),
    },
  ];

  const { t } = useLocale();

  return (
    <div class="w-full flex-1 flex flex-col gap-8">
      <Grid class="w-full gap-4">
        <h1 class="text-3xl font-semibold">Billing</h1>
      </Grid>
      <div class="flex-1">
        <DataTable<Payment, ColumnDef<Payment>> columns={columns} data={data} />
      </div>
    </div>
  );
}

export default Billing;
