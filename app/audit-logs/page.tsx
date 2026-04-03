import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export default async function AuditLogsPage() {
  const rows = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AppShell title="Audit Logs" description="Starter audit trail page. Extend your write operations to record every change.">
      <div className="card table-wrap">
        <h2>Audit Trail</h2>
        <table>
          <thead><tr><th>Date</th><th>Entity</th><th>Action</th><th>Actor</th><th>Description</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.createdAt)}</td>
                <td>{row.entityType}</td>
                <td>{row.action}</td>
                <td>{row.actorName ?? "—"}</td>
                <td>{row.description ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
