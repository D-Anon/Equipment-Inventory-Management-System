export function StatusBadge({ value }: { value: string }) {
  const v = value.toLowerCase();
  const cls =
    v === "available"
      ? "available"
      : v === "borrowed" || v === "retired"
      ? "borrowed"
      : v === "under repair" || v === "pending" || v === "repaired" || v === "disposed"
      ? "repair"
      : "low";
  return <span className={`badge ${cls}`}>{value}</span>;
}
