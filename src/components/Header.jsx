import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Calculator } from "lucide-react";
import SearchBar from "./SearchBar.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { CATEGORY_LIST } from "../data/categories.js";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Finance", href: "/finance" },
  { label: "Math", href: "/math" },
  { label: "Health", href: "/health" },
  { label: "Education", href: "/education" },
  { label: "Developer Tools", href: "/developer-tools" },
];

export default function Header({ theme, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur"
      style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)", borderColor: "var(--border)" }}
    >
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="IruCalc home">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "var(--color-signal-600)" }}
          >
            <Calculator className="h-5 w-5 text-white" strokeWidth={2} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
            Calcora
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "" : "hover:opacity-70"}`
              }
              style={({ isActive }) => ({
                color: isActive ? "var(--color-signal-600)" : "var(--text)",
                background: isActive ? "var(--color-signal-100)" : "transparent",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block flex-1 max-w-sm ml-auto">
          <SearchBar />
        </div>

        <button
          className="md:hidden ml-auto"
          aria-label="Toggle search"
          onClick={() => setMobileSearchOpen((v) => !v)}
        >
          <SearchIconMobile />
        </button>

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <button
          className="lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileSearchOpen && (
        <div className="md:hidden border-t px-4 py-3" style={{ borderColor: "var(--border)" }}>
          <SearchBar autoFocus onNavigate={() => setMobileSearchOpen(false)} />
        </div>
      )}

      {mobileOpen && (
        <nav className="lg:hidden border-t px-4 py-3 space-y-1" style={{ borderColor: "var(--border)" }} aria-label="Mobile primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium"
              style={({ isActive }) => ({
                color: isActive ? "var(--color-signal-600)" : "var(--text)",
                background: isActive ? "var(--color-signal-100)" : "transparent",
              })}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2 mt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              All categories
            </p>
            {CATEGORY_LIST.map((c) => (
              <NavLink
                key={c.slug}
                to={`/${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm"
                style={{ color: "var(--text)" }}
              >
                {c.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function SearchIconMobile() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
