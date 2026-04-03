import { StatusBadge } from "@/components/shared/status-badge";

type Row = {
  id: string;
  supplyId: string;
  itemName: string;
  stockOnHand: number;
  reorderLevel: number;
  office: { name: string } | null;
};

export function LowStockTable({ rows }: { rows: Row[] }) {
  return (
    <div className="card table-wrap">
      <h2>Low Stock Alerts</h2>
      <table>
        <thead>
          <tr>
            <th>Supply ID</th>
            <th>Item</th>
            <th>Stock</th>
            <th>Reorder Level</th>
            <th>Office</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.supplyId}</td>
              <td>{row.itemName}</td>
              <td>{row.stockOnHand}</td>
              <td>{row.reorderLevel}</td>
              <td>{row.office?.name ?? "—"}</td>
              <td><StatusBadge value="Low Stock" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
