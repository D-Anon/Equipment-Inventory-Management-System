import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";

export default async function DepartmentsPage() {
  const rows = await prisma.department.findMany({
    orderBy: { name: "asc" },
    include: { equipment: true, personnel: true }
  });

  return (
    <AppShell title="Departments" description="Department reference page for assets and personnel.">
      <div className="card table-wrap">
        <h2>Departments</h2>
        <table>
          <thead><tr><th>Department</th><th>Equipment</th><th>Personnel</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.equipment.length}</td>
                <td>{row.personnel.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
