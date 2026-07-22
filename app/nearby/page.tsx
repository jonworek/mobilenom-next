import Link from "next/link";

import NearbyExplorer from "./nearby-explorer";

export const metadata = { title: "Nearby food trucks — Mobile Nom" };

export default function NearbyPage() {
  return (
    <main className="nearby-page">
      <nav className="nav shell">
        <Link className="brand" href="/">
          <span>MN</span> mobile nom
        </Link>
        <Link className="back-link" href="/">
          ← Home
        </Link>
      </nav>
      <NearbyExplorer />
    </main>
  );
}
