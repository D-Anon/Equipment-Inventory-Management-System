import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/format";

type Row = {
  id: string;
  transactionId: string;
  type: string;
  status: string;
  borrowerName: string | null;
  dueDate: Date | null;
  equipment: { assetId: string; name: string };
};

export function RecentTransactions({ rows }: { rows: Row[] }) {
  return (
    <div className="card table-wrap">
      <h2>Recent Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Asset ID</th>
            <th>Equipment</th>
            <th>Type</th>
            <th>Borrower</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.transactionId}</td>
              <td>{row.equipment.assetId}</td>
              <td>{row.equipment.name}</td>
              <td>{row.type}</td>
              <td>{row.borrowerName ?? "—"}</td>
              <td>{formatDate(row.dueDate)}</td>
              <td><StatusBadge value={row.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
