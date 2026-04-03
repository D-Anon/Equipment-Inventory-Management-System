import { AppShell } from "@/components/shared/app-shell";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const rows = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AppShell title="Users" description="Starter admin users page. Authentication is still a future step.">
      <div className="card table-wrap">
        <h2>Users</h2>
        <table>
          <thead><tr><th>Full Name</th><th>Email</th><th>Role</th><th>Active</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.fullName}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>{row.isActive ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
