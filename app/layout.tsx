import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equipment Inventory",
  description: "Expanded inventory system starter"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
