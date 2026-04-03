"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/equipment", label: "Equipment" },
  { href: "/transactions", label: "Transactions" },
  { href: "/maintenance", label: "Maintenance" },
  { href: "/supplies", label: "Supplies" },
  { href: "/supply-transactions", label: "Supply Ledger" },
  { href: "/personnel", label: "Personnel" },
  { href: "/reports", label: "Reports" },
  { href: "/alerts", label: "Alerts" },
  { href: "/audit-logs", label: "Audit Logs" },
  { href: "/disposals", label: "Disposals" },
  { href: "/offices", label: "Offices" },
  { href: "/departments", label: "Departments" },
  { href: "/users", label: "Users" },
  { href: "/settings", label: "Settings" },
  { href: "/search", label: "Search" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <h1>Equipment Inventory</h1>
      <nav>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
