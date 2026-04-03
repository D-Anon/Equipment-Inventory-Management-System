import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const rows = await prisma.setting.findMany({ orderBy: { key: "asc" } });

  return (
    <AppShell title="Settings" description="Starter system settings page. Extend with editable forms later.">
      <div className="card table-wrap">
        <h2>Settings</h2>
        <table>
          <thead><tr><th>Key</th><th>Value</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.key}</td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
