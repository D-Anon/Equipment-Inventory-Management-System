import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";
import { PersonnelManager } from "@/components/crud/personnel-manager";

export default async function PersonnelPage() {
  const [rows, offices, departments] = await Promise.all([
    prisma.personnel.findMany({ orderBy: { createdAt: "desc" }, include: { office: true, department: true } }),
    prisma.office.findMany({ orderBy: { name: "asc" } }),
    prisma.department.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <AppShell title="Personnel" description="Personnel directory for accountable borrowing and office assignment.">
      <PersonnelManager rows={rows} offices={offices} departments={departments} />
    </AppShell>
  );
}
