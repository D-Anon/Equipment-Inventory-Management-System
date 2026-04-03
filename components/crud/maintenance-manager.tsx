"use client";

import { useState } from "react";
import { Modal } from "@/components/shared/modal";

type Equipment = { id: string; assetId: string; name: string };

export function MaintenanceManager({ equipment }: { equipment: Equipment[] }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({
    equipmentId: "",
    issue: "",
    technician: "",
    status: "Pending",
    remarks: ""
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const res = await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage({ type: "error", text: data.message || "Failed to save maintenance record." });
      return;
    }

    setMessage({ type: "success", text: "Saved successfully. Refresh the page to view updates." });
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>New Maintenance</button>
      <Modal open={open} title="Maintenance Record" onClose={() => setOpen(false)}>
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
              <label>Issue</label>
              <textarea value={form.issue} onChange={(e) => setForm((p) => ({ ...p, issue: e.target.value }))} required />
            </div>
            <div className="field"><label>Technician</label><input value={form.technician} onChange={(e) => setForm((p) => ({ ...p, technician: e.target.value }))} /></div>
            <div className="field"><label>Status</label><select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}><option>Pending</option><option>Diagnosed</option><option>Under Repair</option><option>Repaired</option></select></div>
            <div className="field full"><label>Remarks</label><textarea value={form.remarks} onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))} /></div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Close</button>
            <button type="submit" className="btn btn-primary">Save Maintenance</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
