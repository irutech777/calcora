import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";
import { CATEGORY_LIST } from "../data/categories.js";

// lucide-react's current release ships generic icons only (no brand marks),
// so social links use small inline glyphs instead of importing a brand pack.
function SocialGlyph({ label, path }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}
const GLYPHS = {
  x: "M18.9 3H21l-6.6 7.55L22.2 21h-6.4l-5-6.5-5.7 6.5H2l7.1-8.1L1.9 3h6.5l4.5 5.9L18.9 3Zm-1.1 16h1.7L7.3 4.9H5.5L17.8 19Z",
  github: "M12 2a10 10 0 0 0-3.16 19.5c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z",
  linkedin: "M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3.2 8.75h3.5V21h-3.5V8.75Zm6.2 0h3.35v1.68h.05c.47-.88 1.6-1.8 3.3-1.8 3.53 0 4.18 2.32 4.18 5.35V21h-3.5v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-3.5V8.75Z",
};

export default function Footer() {
  return (
    <footer className="border-t mt-20" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--color-signal-600)" }}>
              <Calculator className="h-4 w-4 text-white" strokeWidth={2} />
            </span>
            <span className="font-display text-base font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
              Calcora
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm" style={{ color: "var(--text-muted)" }}>
            Free online calculators for everyday use. No sign-up, no fuss — your data stays on your device.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a href="#" aria-label="IruCalc on X" style={{ color: "var(--text-muted)" }}><SocialGlyph path={GLYPHS.x} /></a>
            <a href="#" aria-label="IruCalc on GitHub" style={{ color: "var(--text-muted)" }}><SocialGlyph path={GLYPHS.github} /></a>
            <a href="#" aria-label="IruCalc on LinkedIn" style={{ color: "var(--text-muted)" }}><SocialGlyph path={GLYPHS.linkedin} /></a>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-muted)" }}>Categories</p>
          <ul className="space-y-2 text-sm">
            {CATEGORY_LIST.map((c) => (
              <li key={c.slug}>
                <Link to={`/${c.slug}`} style={{ color: "var(--text)" }} className="hover:opacity-70">{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-muted)" }}>Important Links</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" style={{ color: "var(--text)" }} className="hover:opacity-70">About</Link></li>
            <li><Link to="/contact" style={{ color: "var(--text)" }} className="hover:opacity-70">Contact</Link></li>
            <li><Link to="/privacy-policy" style={{ color: "var(--text)" }} className="hover:opacity-70">Privacy Policy</Link></li>
            <li><Link to="/terms" style={{ color: "var(--text)" }} className="hover:opacity-70">Terms</Link></li>
            <li><Link to="/disclaimer" style={{ color: "var(--text)" }} className="hover:opacity-70">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        © 2026 IruCalc. All rights reserved.
      </div>
    </footer>
  );
}
