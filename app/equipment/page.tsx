import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";
import { EquipmentManager } from "@/components/crud/equipment-manager";

export default async function EquipmentPage() {
  const [rows, offices, departments] = await Promise.all([
    prisma.equipment.findMany({ orderBy: { createdAt: "desc" }, include: { office: true } }),
    prisma.office.findMany({ orderBy: { name: "asc" } }),
    prisma.department.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <AppShell title="Equipment" description="Manage equipment records with modal CRUD UI.">
      <EquipmentManager rows={rows} offices={offices} departments={departments} />
    </AppShell>
  );
}
