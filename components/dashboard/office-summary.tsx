type Row = {
  office: string;
  equipmentCount: number;
  borrowedCount: number;
  repairCount: number;
  supplyCount: number;
};

export function OfficeSummary({ rows }: { rows: Row[] }) {
  return (
    <div className="card table-wrap">
      <h2>Office Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Office</th>
            <th>Equipment</th>
            <th>Borrowed</th>
            <th>Under Repair</th>
            <th>Supply Items</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.office}>
              <td>{row.office}</td>
              <td>{row.equipmentCount}</td>
              <td>{row.borrowedCount}</td>
              <td>{row.repairCount}</td>
              <td>{row.supplyCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
