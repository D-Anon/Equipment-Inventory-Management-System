"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/shared/modal";

type Option = { id: string; name: string };
type Row = {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string | null;
  position: string | null;
  status: string;
  officeId: string | null;
  departmentId: string | null;
  office: { name: string } | null;
  department: { name: string } | null;
};

const blank = {
  employeeCode: "",
  fullName: "",
  email: "",
  contactNumber: "",
  position: "",
  status: "Active",
  officeId: "",
  departmentId: ""
};

export function PersonnelManager({ rows, offices, departments }: { rows: Row[]; offices: Option[]; departments: Option[] }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter((row) => [row.employeeCode, row.fullName, row.email, row.position, row.office?.name].join(" ").toLowerCase().includes(q));
  }, [rows, query]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const res = await fetch("/api/personnel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, email: form.email || null, contactNumber: form.contactNumber || null, position: form.position || null, officeId: form.officeId || null, departmentId: form.departmentId || null })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage({ type: "error", text: data.message || "Failed to save personnel." });
      return;
    }

    setMessage({ type: "success", text: "Saved successfully. Refresh the page to view updates." });
  }

  return (
    <>
      <div className="card table-wrap">
        <div className="toolbar">
          <div className="toolbar-left">
            <button className="btn btn-primary" onClick={() => setOpen(true)}>Add Personnel</button>
            <input className="search-input" placeholder="Search personnel..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <span className="muted">{filtered.length} record(s)</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Office</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{row.employeeCode}</td>
                <td>{row.fullName}</td>
                <td>{row.email ?? "—"}</td>
                <td>{row.position ?? "—"}</td>
                <td>{row.office?.name ?? "—"}</td>
                <td>{row.department?.name ?? "—"}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title="Add Personnel" onClose={() => setOpen(false)}>
        {message ? <div className={`notice ${message.type}`}>{message.text}</div> : null}
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="field"><label>Employee Code</label><input value={form.employeeCode} onChange={(e) => setForm((p) => ({ ...p, employeeCode: e.target.value }))} required /></div>
            <div className="field"><label>Full Name</label><input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} required /></div>
            <div className="field"><label>Email</label><input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></div>
            <div className="field"><label>Contact Number</label><input value={form.contactNumber} onChange={(e) => setForm((p) => ({ ...p, contactNumber: e.target.value }))} /></div>
            <div className="field"><label>Position</label><input value={form.position} onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))} /></div>
            <div className="field"><label>Status</label><select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}><option>Active</option><option>Inactive</option></select></div>
            <div className="field"><label>Office</label><select value={form.officeId} onChange={(e) => setForm((p) => ({ ...p, officeId: e.target.value }))}><option value="">— Select —</option>{offices.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
            <div className="field"><label>Department</label><select value={form.departmentId} onChange={(e) => setForm((p) => ({ ...p, departmentId: e.target.value }))}><option value="">— Select —</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Close</button>
            <button type="submit" className="btn btn-primary">Save Personnel</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
