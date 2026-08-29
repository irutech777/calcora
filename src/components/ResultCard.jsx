import { useState } from "react";
import { Copy, Check, Printer } from "lucide-react";
import ShareButton from "./ShareButton.jsx";

export function ResultRow({ label, value, highlight, mono }) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 ${highlight ? "py-3" : "py-2"}`}
    >
      <span className={`text-sm ${highlight ? "opacity-80" : ""}`}>{label}</span>
      <span className="flex items-center gap-2">
        <span
          className={`tabular-nums text-right ${highlight ? "text-2xl sm:text-3xl font-semibold" : "text-base font-medium"} ${mono ? "font-mono break-all" : ""}`}
        >
          {value}
        </span>
        <button type="button" onClick={copyValue} aria-label={`Copy ${label}`} className="opacity-60 hover:opacity-100">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </span>
    </div>
  );
}

export default function ResultCard({ results, title = "Result", onPrint, shareText }) {
  if (!results) return null;
  return (
    <div className="lcd-panel p-5 sm:p-6">
      <div className="relative flex items-center justify-between mb-2">
        <p className="text-xs uppercase tracking-wider opacity-70">{title}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrint || (() => window.print())}
            aria-label="Print result"
            className="opacity-70 hover:opacity-100"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="relative divide-y divide-white/10">
        {results.map((r, i) => (
          <ResultRow key={i} {...r} />
        ))}
      </div>
      <div className="relative mt-4 flex justify-end">
        <ShareButton text={shareText} light />
      </div>
    </div>
  );
}
