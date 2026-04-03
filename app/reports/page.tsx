import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const [equipment, supplies, transactions, maintenance, disposals] = await Promise.all([
    prisma.equipment.findMany({ include: { office: true } }),
    prisma.supply.findMany({ include: { office: true } }),
    prisma.transaction.findMany({ include: { equipment: true } }),
    prisma.maintenanceLog.findMany({ include: { equipment: true } }),
    prisma.disposal.findMany({ include: { equipment: true } })
  ]);

  const equipmentByOffice = Object.entries(
    equipment.reduce<Record<string, number>>((acc, item) => {
      const key = item.office?.name ?? "Unassigned";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  );

  return (
    <AppShell title="Reports" description="Starter reports hub for assets, transactions, maintenance, and stock.">
      <div className="grid grid-2">
        <div className="card table-wrap">
          <h2>Equipment by Office</h2>
          <table><thead><tr><th>Office</th><th>Count</th></tr></thead><tbody>
            {equipmentByOffice.map(([office, count]) => <tr key={office}><td>{office}</td><td>{count}</td></tr>)}
          </tbody></table>
        </div>

        <div className="card table-wrap">
          <h2>System Totals</h2>
          <table><tbody>
            <tr><td>Total Equipment</td><td>{equipment.length}</td></tr>
            <tr><td>Total Supplies</td><td>{supplies.length}</td></tr>
            <tr><td>Total Transactions</td><td>{transactions.length}</td></tr>
            <tr><td>Total Maintenance Logs</td><td>{maintenance.length}</td></tr>
            <tr><td>Total Disposals</td><td>{disposals.length}</td></tr>
          </tbody></table>
        </div>
      </div>
    </AppShell>
  );
}
