import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/shared/status-badge";
import { DisposalManager } from "@/components/crud/disposal-manager";

export default async function DisposalsPage() {
  const [rows, equipment] = await Promise.all([
    prisma.disposal.findMany({ orderBy: { createdAt: "desc" }, include: { equipment: true } }),
    prisma.equipment.findMany({ orderBy: { assetId: "asc" }, select: { id: true, assetId: true, name: true } })
  ]);

  return (
    <AppShell title="Disposals" description="Track retired, disposed, and lost assets.">
      <div style={{ marginBottom: 16 }}>
        <DisposalManager equipment={equipment} />
      </div>

      <div className="card table-wrap">
        <h2>Disposal Records</h2>
        <table>
          <thead><tr><th>ID</th><th>Equipment</th><th>Reason</th><th>Status</th><th>Approved By</th><th>Date</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.disposalId}</td>
                <td>{row.equipment.name}</td>
                <td>{row.reason}</td>
                <td><StatusBadge value={row.status} /></td>
                <td>{row.approvedBy ?? "—"}</td>
                <td>{formatDate(row.disposedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
