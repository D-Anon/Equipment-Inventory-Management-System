import { AppShell } from "@/components/shared/app-shell";

export default function SearchPage() {
  return (
    <AppShell title="Search" description="Global search API for equipment lookup.">
      <div className="card">
        <h2>Search API</h2>
        <p className="muted">Use the endpoint below to search equipment by asset ID, serial number, name, category, office, or assigned person.</p>
        <div className="code-card">GET /api/search?q=printer</div>
      </div>
    </AppShell>
  );
}
