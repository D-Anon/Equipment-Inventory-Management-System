import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/shared/status-badge";
import { MaintenanceManager } from "@/components/crud/maintenance-manager";

export default async function MaintenancePage() {
  const [rows, equipment] = await Promise.all([
    prisma.maintenanceLog.findMany({ orderBy: { createdAt: "desc" }, include: { equipment: true } }),
    prisma.equipment.findMany({ orderBy: { assetId: "asc" }, select: { id: true, assetId: true, name: true } })
  ]);

  return (
    <AppShell title="Maintenance" description="Track issues, technicians, and repair status.">
      <div style={{ marginBottom: 16 }}>
        <MaintenanceManager equipment={equipment} />
      </div>
      <div className="card table-wrap">
        <h2>Maintenance Logs</h2>
        <table>
          <thead><tr><th>ID</th><th>Equipment</th><th>Issue</th><th>Technician</th><th>Created</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.maintenanceId}</td>
                <td>{row.equipment.name}</td>
                <td>{row.issue}</td>
                <td>{row.technician ?? "—"}</td>
                <td>{formatDate(row.createdAt)}</td>
                <td><StatusBadge value={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
