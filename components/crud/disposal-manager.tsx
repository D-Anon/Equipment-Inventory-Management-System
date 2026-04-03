"use client";

import { useState } from "react";
import { Modal } from "@/components/shared/modal";

type Equipment = { id: string; assetId: string; name: string };

export function DisposalManager({ equipment }: { equipment: Equipment[] }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({
    equipmentId: "",
    reason: "",
    status: "Retired",
    approvedBy: "",
    remarks: ""
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const res = await fetch("/api/disposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, approvedBy: form.approvedBy || null, remarks: form.remarks || null })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage({ type: "error", text: data.message || "Failed to save disposal." });
      return;
    }

    setMessage({ type: "success", text: "Saved successfully. Refresh the page to view updates." });
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>Record Disposal</button>
      <Modal open={open} title="Disposal / Retirement" onClose={() => setOpen(false)}>
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
            <div className="field full">
              <label>Reason</label>
              <textarea value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} required />
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                <option>Retired</option>
                <option>Disposed</option>
                <option>Lost</option>
              </select>
            </div>
            <div className="field">
              <label>Approved By</label>
              <input value={form.approvedBy} onChange={(e) => setForm((p) => ({ ...p, approvedBy: e.target.value }))} />
            </div>
            <div className="field full">
              <label>Remarks</label>
              <textarea value={form.remarks} onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Close</button>
            <button type="submit" className="btn btn-primary">Save Disposal</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
