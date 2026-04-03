import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/shared/stat-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { OfficeSummary } from "@/components/dashboard/office-summary";
import { LowStockTable } from "@/components/dashboard/low-stock-table";

export default async function DashboardPage() {
  const [equipment, supplies, transactions, maintenance, offices, disposals] = await Promise.all([
    prisma.equipment.findMany({ include: { office: true } }),
    prisma.supply.findMany({ include: { office: true } }),
    prisma.transaction.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { equipment: { select: { assetId: true, name: true } } } }),
    prisma.maintenanceLog.findMany(),
    prisma.office.findMany({ orderBy: { name: "asc" } }),
    prisma.disposal.findMany()
  ]);

  const officeSummary = offices.map((office) => {
    const officeEquipment = equipment.filter((row) => row.officeId === office.id);
    const officeSupplies = supplies.filter((row) => row.officeId === office.id);
    return {
      office: office.name,
      equipmentCount: officeEquipment.length,
      borrowedCount: officeEquipment.filter((row) => row.status === "Borrowed").length,
      repairCount: officeEquipment.filter((row) => row.status === "Under Repair").length,
      supplyCount: officeSupplies.length
    };
  });

  const lowStock = supplies.filter((row) => row.stockOnHand <= row.reorderLevel);

  return (
    <AppShell title="Dashboard" description="Overview of equipment, supplies, personnel, and current activity.">
      <div className="grid grid-4">
        <StatCard label="Total Equipment" value={equipment.length} />
        <StatCard label="Available" value={equipment.filter((x) => x.status === "Available").length} />
        <StatCard label="Borrowed" value={equipment.filter((x) => x.status === "Borrowed").length} />
        <StatCard label="Under Repair" value={equipment.filter((x) => x.status === "Under Repair").length} />
      </div>

      <div className="grid grid-4" style={{ marginTop: 16 }}>
        <StatCard label="Total Supplies" value={supplies.length} />
        <StatCard label="Low Stock Items" value={lowStock.length} />
        <StatCard label="Open Maintenance" value={maintenance.filter((m) => m.status !== "Repaired").length} />
        <StatCard label="Disposed / Retired" value={disposals.length} />
      </div>

      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <RecentTransactions rows={transactions} />
        <OfficeSummary rows={officeSummary} />
      </div>

      <div style={{ marginTop: 16 }}>
        <LowStockTable rows={lowStock} />
      </div>
    </AppShell>
  );
}
