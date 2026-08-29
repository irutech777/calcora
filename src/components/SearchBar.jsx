import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { searchCalculators } from "../data/calculatorConfig.js";
import Icon from "./Icon.jsx";

export default function SearchBar({ variant = "default", autoFocus = false, onNavigate }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const results = useMemo(() => searchCalculators(query).slice(0, 8), [query]);

  function go(slug) {
    navigate(`/calculators/${slug}`);
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
    onNavigate?.();
  }

  function handleKeyDown(e) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      go(results[activeIndex].slug);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const isHero = variant === "hero";

  return (
    <div className="relative w-full">
      <div
        className={`flex items-center gap-2 rounded-full border px-4 ${isHero ? "h-14 text-base" : "h-10 text-sm"}`}
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-label="Search calculators"
          autoFocus={autoFocus}
          placeholder="Search calculator..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          className="flex-1 bg-transparent outline-none placeholder:text-current"
          style={{ color: "var(--text)" }}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border shadow-lg"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          role="listbox"
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm" style={{ color: "var(--text-muted)" }}>
              No calculators found for "{query}".
            </p>
          ) : (
            results.map((r, i) => (
              <button
                key={r.slug}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(r.slug)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
                style={{ background: i === activeIndex ? "var(--surface-2)" : "transparent" }}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "var(--color-signal-100)", color: "var(--color-signal-600)" }}
                >
                  <Icon name={r.icon} className="w-4 h-4" />
                </span>
                <span>
                  <span className="block font-medium" style={{ color: "var(--text)" }}>{r.name}</span>
                  <span className="block text-xs capitalize" style={{ color: "var(--text-muted)" }}>{r.category.replace("-", " ")}</span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
