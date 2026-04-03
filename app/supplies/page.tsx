import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";
import { SupplyManager } from "@/components/crud/supply-manager";

export default async function SuppliesPage() {
  const [rows, offices] = await Promise.all([
    prisma.supply.findMany({ orderBy: { createdAt: "desc" }, include: { office: true } }),
    prisma.office.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <AppShell title="Supplies" description="Manage consumables and reorder levels with modal CRUD UI.">
      <SupplyManager rows={rows} offices={offices} />
    </AppShell>
  );
}
