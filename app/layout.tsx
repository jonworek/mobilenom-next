import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Mobile Nom — Food in motion", description: "Find the food trucks worth following." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
