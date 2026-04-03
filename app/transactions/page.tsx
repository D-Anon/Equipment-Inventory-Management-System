import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TransactionManager } from "@/components/crud/transaction-manager";

export default async function TransactionsPage() {
  const [rows, equipment, offices, departments] = await Promise.all([
    prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      include: { equipment: { select: { assetId: true, name: true } } }
    }),
    prisma.equipment.findMany({ orderBy: { assetId: "asc" }, select: { id: true, assetId: true, name: true } }),
    prisma.office.findMany({ orderBy: { name: "asc" } }),
    prisma.department.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <AppShell title="Transactions" description="Borrow, return, and transfer items from a single modal form.">
      <div style={{ marginBottom: 16 }}>
        <TransactionManager equipment={equipment} offices={offices} departments={departments} />
      </div>
      <RecentTransactions rows={rows.slice(0, 30)} />
    </AppShell>
  );
}
