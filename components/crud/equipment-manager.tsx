"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Modal } from "@/components/shared/modal";
import { StatusBadge } from "@/components/shared/status-badge";

type Option = { id: string; name: string };
type Row = {
  id: string;
  assetId: string;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  status: string;
  condition: string;
  assignedTo: string | null;
  officeId: string | null;
  departmentId: string | null;
  office: { name: string } | null;
};

const blank = {
  id: "",
  assetId: "",
  name: "",
  category: "",
  brand: "",
  model: "",
  serialNumber: "",
  status: "Available",
  condition: "Good",
  assignedTo: "",
  officeId: "",
  departmentId: "",
  location: "",
  remarks: ""
};

export function EquipmentManager({ rows, offices, departments }: { rows: Row[]; offices: Option[]; departments: Option[]; }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<typeof blank>(blank);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter((row) =>
      [row.assetId, row.name, row.category, row.office?.name, row.assignedTo, row.serialNumber].join(" ").toLowerCase().includes(q)
    );
  }, [rows, query]);

  function openCreate() {
    setEditing({ ...blank, assetId: "EQ-AUTO" });
    setMessage(null);
    setOpen(true);
  }

  function openEdit(row: Row) {
    setEditing({
      id: row.id,
      assetId: row.assetId,
      name: row.name,
      category: row.category,
      brand: row.brand ?? "",
      model: row.model ?? "",
      serialNumber: row.serialNumber ?? "",
      status: row.status,
      condition: row.condition,
      assignedTo: row.assignedTo ?? "",
      officeId: row.officeId ?? "",
      departmentId: row.departmentId ?? "",
      location: "",
      remarks: ""
    });
    setMessage(null);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const payload = {
      ...editing,
      assetId: editing.id ? editing.assetId : "",
      brand: editing.brand || null,
      model: editing.model || null,
      serialNumber: editing.serialNumber || null,
      assignedTo: editing.assignedTo || null,
      officeId: editing.officeId || null,
      departmentId: editing.departmentId || null
    };

    const res = await fetch(editing.id ? `/api/equipment/${editing.id}` : "/api/equipment", {
      method: editing.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage({ type: "error", text: data.message || "Failed to save equipment." });
      return;
    }

    setMessage({ type: "success", text: "Saved successfully. Refresh the page to view the latest data." });
  }

  return (
    <>
      <div className="card table-wrap">
        <div className="toolbar">
          <div className="toolbar-left">
            <button className="btn btn-primary" onClick={openCreate}>Add Equipment</button>
            <input className="search-input" placeholder="Search equipment..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <span className="muted">{filtered.length} record(s)</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Office</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{row.assetId}</td>
                <td>{row.name}</td>
                <td>{row.category}</td>
                <td>{row.office?.name ?? "—"}</td>
                <td>{row.assignedTo ?? "—"}</td>
                <td><StatusBadge value={row.status} /></td>
                <td><button className="btn btn-secondary" onClick={() => openEdit(row)}>Edit</button></td>
                <td><Link className="btn btn-secondary" href={`/equipment/${row.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editing.id ? "Edit Equipment" : "Add Equipment"} onClose={() => setOpen(false)}>
        {message ? <div className={`notice ${message.type}`}>{message.text}</div> : null}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Asset ID</label>
              <input value={editing.id ? editing.assetId : "Auto-generated on save"} disabled />
            </div>
            <div className="field">
              <label>Name</label>
              <input value={editing.name} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="field">
              <label>Category</label>
              <input value={editing.category} onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value }))} required />
            </div>
            <div className="field">
              <label>Condition</label>
              <select value={editing.condition} onChange={(e) => setEditing((p) => ({ ...p, condition: e.target.value }))}>
                <option>Good</option><option>Fair</option><option>Damaged</option><option>Defective</option>
              </select>
            </div>
            <div className="field">
              <label>Status</label>
              <select value={editing.status} onChange={(e) => setEditing((p) => ({ ...p, status: e.target.value }))}>
                <option>Available</option><option>Borrowed</option><option>Under Repair</option><option>Retired</option>
              </select>
            </div>
            <div className="field">
              <label>Office</label>
              <select value={editing.officeId} onChange={(e) => setEditing((p) => ({ ...p, officeId: e.target.value }))}>
                <option value="">— Select —</option>
                {offices.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Department</label>
              <select value={editing.departmentId} onChange={(e) => setEditing((p) => ({ ...p, departmentId: e.target.value }))}>
                <option value="">— Select —</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Assigned To</label>
              <input value={editing.assignedTo} onChange={(e) => setEditing((p) => ({ ...p, assignedTo: e.target.value }))} />
            </div>
            <div className="field">
              <label>Brand</label>
              <input value={editing.brand} onChange={(e) => setEditing((p) => ({ ...p, brand: e.target.value }))} />
            </div>
            <div className="field">
              <label>Model</label>
              <input value={editing.model} onChange={(e) => setEditing((p) => ({ ...p, model: e.target.value }))} />
            </div>
            <div className="field full">
              <label>Serial Number</label>
              <input value={editing.serialNumber} onChange={(e) => setEditing((p) => ({ ...p, serialNumber: e.target.value }))} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Close</button>
            <button type="submit" className="btn btn-primary">Save Equipment</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
