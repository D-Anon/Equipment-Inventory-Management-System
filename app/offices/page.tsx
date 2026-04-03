import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";

export default async function OfficesPage() {
  const offices = await prisma.office.findMany({
    orderBy: { name: "asc" },
    include: { equipment: true, supplies: true, personnel: true }
  });

  return (
    <AppShell title="Offices" description="Office-level inventory and staffing summary.">
      <div className="card table-wrap">
        <h2>Office Summary</h2>
        <table>
          <thead><tr><th>Office</th><th>Equipment</th><th>Supplies</th><th>Personnel</th></tr></thead>
          <tbody>
            {offices.map((office) => (
              <tr key={office.id}>
                <td>{office.name}</td>
                <td>{office.equipment.length}</td>
                <td>{office.supplies.length}</td>
                <td>{office.personnel.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
