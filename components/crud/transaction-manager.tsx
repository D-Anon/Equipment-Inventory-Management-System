"use client";

import { useState } from "react";
import { Modal } from "@/components/shared/modal";

type Equipment = { id: string; assetId: string; name: string };
type Office = { id: string; name: string };
type Department = { id: string; name: string };

export function TransactionManager({ equipment, offices, departments }: { equipment: Equipment[]; offices: Office[]; departments: Department[]; }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({
    equipmentId: "",
    type: "Borrow",
    borrowerName: "",
    dueDate: "",
    officeId: "",
    departmentId: "",
    remarks: ""
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, officeId: form.officeId || null, departmentId: form.departmentId || null })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage({ type: "error", text: data.message || "Failed to save transaction." });
      return;
    }

    setMessage({ type: "success", text: "Saved successfully. Refresh the page to view updates." });
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>New Transaction</button>
      <Modal open={open} title="Borrow / Return / Transfer" onClose={() => setOpen(false)}>
        {message ? <div className={`notice ${message.type}`}>{message.text}</div> : null}
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="field full">
              <label>Equipment</label>
              <select value={form.equipmentId} onChange={(e) => setForm((p) => ({ ...p, equipmentId: e.target.value }))} required>
                <option value="">— Select Equipment —</option>
                {equipment.map((item) => <option key={item.id} value={item.id}>{item.assetId} — {item.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Transaction Type</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                <option>Borrow</option><option>Return</option><option>Transfer</option>
              </select>
            </div>
            <div className="field">
              <label>Borrower Name</label>
              <input value={form.borrowerName} onChange={(e) => setForm((p) => ({ ...p, borrowerName: e.target.value }))} />
            </div>
            <div className="field">
              <label>Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
            </div>
            <div className="field">
              <label>Office</label>
              <select value={form.officeId} onChange={(e) => setForm((p) => ({ ...p, officeId: e.target.value }))}>
                <option value="">— Select —</option>
                {offices.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Department</label>
              <select value={form.departmentId} onChange={(e) => setForm((p) => ({ ...p, departmentId: e.target.value }))}>
                <option value="">— Select —</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="field full">
              <label>Remarks</label>
              <textarea value={form.remarks} onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Close</button>
            <button type="submit" className="btn btn-primary">Save Transaction</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
