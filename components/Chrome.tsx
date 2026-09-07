import Link from "next/link";

export function Header() {
  return (
    <header className="container site-header">
      <Link href="/" className="brand">
        Teoriprøver<span className="dot">.</span>
      </Link>
      <nav style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <Link href="/#categories" style={{ color: "var(--muted)" }}>
          Categories
        </Link>
        <Link href="/#pricing" style={{ color: "var(--muted)" }}>
          Pricing
        </Link>
        <Link href="/quiz" className="btn secondary" style={{ padding: "10px 18px" }}>
          Start practice
        </Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="container site-footer">
      <span>© {new Date().getFullYear()} Teoriprøver. Independent study tool.</span>
      <span>
        Not affiliated with Færdselsstyrelsen. Content is original study material
        based on public Danish traffic rules.
      </span>
    </footer>
  );
}
