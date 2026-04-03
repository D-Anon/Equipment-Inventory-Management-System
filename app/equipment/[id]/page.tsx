import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/format";

export default async function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const row = await prisma.equipment.findUnique({
    where: { id },
    include: {
      office: true,
      department: true,
      transactions: { orderBy: { createdAt: "desc" } },
      maintenance: { orderBy: { createdAt: "desc" } },
      disposals: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!row) {
    return (
      <AppShell title="Equipment Details" description="Record not found.">
        <div className="card">Equipment not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell title={`Equipment: ${row.assetId}`} description="Full equipment record card.">
      <div className="grid grid-2">
        <div className="card">
          <h2>Profile</h2>
          <div className="stack">
            <div><strong>Name:</strong> {row.name}</div>
            <div><strong>Category:</strong> {row.category}</div>
            <div><strong>Brand / Model:</strong> {row.brand ?? "—"} / {row.model ?? "—"}</div>
            <div><strong>Serial Number:</strong> {row.serialNumber ?? "—"}</div>
            <div><strong>Office:</strong> {row.office?.name ?? "—"}</div>
            <div><strong>Department:</strong> {row.department?.name ?? "—"}</div>
            <div><strong>Assigned To:</strong> {row.assignedTo ?? "—"}</div>
            <div><strong>Status:</strong> <StatusBadge value={row.status} /></div>
          </div>
        </div>

        <div className="card">
          <h2>Latest Activity</h2>
          <div className="stack">
            <div><strong>Total Transactions:</strong> {row.transactions.length}</div>
            <div><strong>Total Maintenance Logs:</strong> {row.maintenance.length}</div>
            <div><strong>Total Disposal Records:</strong> {row.disposals.length}</div>
            <div><strong>Created:</strong> {formatDate(row.createdAt)}</div>
            <div><strong>Updated:</strong> {formatDate(row.updatedAt)}</div>
          </div>
        </div>
      </div>

      <div className="card table-wrap" style={{ marginTop: 16 }}>
        <h2>Transaction History</h2>
        <table>
          <thead><tr><th>ID</th><th>Type</th><th>Borrower</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            {row.transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.transactionId}</td>
                <td>{t.type}</td>
                <td>{t.borrowerName ?? "—"}</td>
                <td>{formatDate(t.dueDate)}</td>
                <td><StatusBadge value={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card table-wrap" style={{ marginTop: 16 }}>
        <h2>Maintenance History</h2>
        <table>
          <thead><tr><th>ID</th><th>Issue</th><th>Technician</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>
            {row.maintenance.map((m) => (
              <tr key={m.id}>
                <td>{m.maintenanceId}</td>
                <td>{m.issue}</td>
                <td>{m.technician ?? "—"}</td>
                <td><StatusBadge value={m.status} /></td>
                <td>{formatDate(m.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
