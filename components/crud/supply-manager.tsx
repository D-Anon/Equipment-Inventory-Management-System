"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/shared/modal";
import { StatusBadge } from "@/components/shared/status-badge";

type Office = { id: string; name: string };
type Supply = {
  id: string;
  supplyId: string;
  itemName: string;
  category: string;
  unit: string;
  stockOnHand: number;
  reorderLevel: number;
  officeId: string | null;
  office: { name: string } | null;
};

const blank = {
  id: "",
  supplyId: "",
  itemName: "",
  category: "",
  unit: "",
  stockOnHand: 0,
  reorderLevel: 0,
  officeId: ""
};

export function SupplyManager({ rows, offices }: { rows: Supply[]; offices: Office[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<typeof blank>(blank);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter((row) => [row.supplyId, row.itemName, row.category, row.office?.name].join(" ").toLowerCase().includes(q));
  }, [rows, query]);

  function openCreate() {
    setEditing({ ...blank, supplyId: "SUP-AUTO" });
    setMessage(null);
    setOpen(true);
  }

  function openEdit(row: Supply) {
    setEditing({
      id: row.id,
      supplyId: row.supplyId,
      itemName: row.itemName,
      category: row.category,
      unit: row.unit,
      stockOnHand: row.stockOnHand,
      reorderLevel: row.reorderLevel,
      officeId: row.officeId ?? ""
    });
    setMessage(null);
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const payload = {
      ...editing,
      supplyId: editing.id ? editing.supplyId : "",
      stockOnHand: Number(editing.stockOnHand),
      reorderLevel: Number(editing.reorderLevel),
      officeId: editing.officeId || null
    };

    const res = await fetch(editing.id ? `/api/supplies/${editing.id}` : "/api/supplies", {
      method: editing.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage({ type: "error", text: data.message || "Failed to save supply." });
      return;
    }

    setMessage({ type: "success", text: "Saved successfully. Refresh the page to view updates." });
  }

  return (
    <>
      <div className="card table-wrap">
        <div className="toolbar">
          <div className="toolbar-left">
            <button className="btn btn-primary" onClick={openCreate}>Add Supply</button>
            <input className="search-input" value={query} placeholder="Search supplies..." onChange={(e) => setQuery(e.target.value)} />
          </div>
          <span className="muted">{filtered.length} record(s)</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Supply ID</th>
              <th>Item</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Office</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const low = row.stockOnHand <= row.reorderLevel;
              return (
                <tr key={row.id}>
                  <td>{row.supplyId}</td>
                  <td>{row.itemName}</td>
                  <td>{row.category}</td>
                  <td>{row.stockOnHand}</td>
                  <td>{row.office?.name ?? "—"}</td>
                  <td>{low ? <StatusBadge value="Low Stock" /> : "OK"}</td>
                  <td><button className="btn btn-secondary" onClick={() => openEdit(row)}>Edit</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editing.id ? "Edit Supply" : "Add Supply"} onClose={() => setOpen(false)}>
        {message ? <div className={`notice ${message.type}`}>{message.text}</div> : null}
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="field"><label>Supply ID</label><input value={editing.id ? editing.supplyId : "Auto-generated on save"} disabled /></div>
            <div className="field"><label>Item Name</label><input value={editing.itemName} required onChange={(e) => setEditing((p) => ({ ...p, itemName: e.target.value }))} /></div>
            <div className="field"><label>Category</label><input value={editing.category} required onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value }))} /></div>
            <div className="field"><label>Unit</label><input value={editing.unit} required onChange={(e) => setEditing((p) => ({ ...p, unit: e.target.value }))} /></div>
            <div className="field"><label>Stock On Hand</label><input type="number" min="0" value={editing.stockOnHand} onChange={(e) => setEditing((p) => ({ ...p, stockOnHand: Number(e.target.value) }))} /></div>
            <div className="field"><label>Reorder Level</label><input type="number" min="0" value={editing.reorderLevel} onChange={(e) => setEditing((p) => ({ ...p, reorderLevel: Number(e.target.value) }))} /></div>
            <div className="field full">
              <label>Office</label>
              <select value={editing.officeId} onChange={(e) => setEditing((p) => ({ ...p, officeId: e.target.value }))}>
                <option value="">— Select —</option>
                {offices.map((office) => <option key={office.id} value={office.id}>{office.name}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Close</button>
            <button type="submit" className="btn btn-primary">Save Supply</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
