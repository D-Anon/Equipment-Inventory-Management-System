import { Sidebar } from "@/components/shared/sidebar";

export function AppShell({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <div>
            <h1 className="page-title">{title}</h1>
            {description ? <p className="muted">{description}</p> : null}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
