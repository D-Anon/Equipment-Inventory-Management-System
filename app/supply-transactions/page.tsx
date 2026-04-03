import { AppShell } from "@/components/shared/app-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function SupplyTransactionsPage() {
  const rows = await prisma.supplyTransaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { supply: true, office: true }
  });

  return (
    <AppShell title="Supply Ledger" description="Dedicated stock movement history for consumables.">
      <div className="card table-wrap">
        <h2>Supply Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Supply</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Requested By</th>
              <th>Office</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.transactionId}</td>
                <td>{row.supply.itemName}</td>
                <td><StatusBadge value={row.type} /></td>
                <td>{row.quantity}</td>
                <td>{row.requestedBy ?? "-"}</td>
                <td>{row.office?.name ?? "-"}</td>
                <td>{formatDate(row.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
