import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/shared/status-badge";

export default async function AlertsPage() {
  const [supplies, transactions, equipment] = await Promise.all([
    prisma.supply.findMany({ include: { office: true } }),
    prisma.transaction.findMany({ where: { status: "Ongoing" }, include: { equipment: true } }),
    prisma.equipment.findMany({ where: { officeId: null } })
  ]);

  const lowStock = supplies.filter((s) => s.stockOnHand <= s.reorderLevel);

  return (
    <AppShell title="Alerts" description="Operational alert center for inventory exceptions.">
      <div className="grid grid-2">
        <div className="card table-wrap">
          <h2>Low Stock</h2>
          <table>
            <thead><tr><th>Supply</th><th>Stock</th><th>Reorder</th><th>Office</th><th>Status</th></tr></thead>
            <tbody>
              {lowStock.map((item) => (
                <tr key={item.id}>
                  <td>{item.itemName}</td>
                  <td>{item.stockOnHand}</td>
                  <td>{item.reorderLevel}</td>
                  <td>{item.office?.name ?? "—"}</td>
                  <td><StatusBadge value="Low Stock" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card table-wrap">
          <h2>Ongoing Borrowed Items</h2>
          <table>
            <thead><tr><th>Transaction</th><th>Equipment</th><th>Borrower</th><th>Status</th></tr></thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={item.id}>
                  <td>{item.transactionId}</td>
                  <td>{item.equipment.name}</td>
                  <td>{item.borrowerName ?? "—"}</td>
                  <td><StatusBadge value={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card table-wrap" style={{ marginTop: 16 }}>
        <h2>Equipment Without Office Assignment</h2>
        <table>
          <thead><tr><th>Asset ID</th><th>Name</th><th>Category</th><th>Status</th></tr></thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.id}>
                <td>{item.assetId}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td><StatusBadge value={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
