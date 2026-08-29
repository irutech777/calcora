export default function InputField({ field, value, onChange, error, options }) {
  const id = `field-${field.id}`;
  const resolvedOptions = options || field.options || [];

  if (field.type === "checkbox") {
    return (
      <label htmlFor={id} className="flex items-center gap-2.5 py-1 text-sm" style={{ color: "var(--text)" }}>
        <input
          id={id}
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(field.id, e.target.checked)}
          className="h-4 w-4 rounded"
          style={{ accentColor: "var(--color-signal-600)" }}
        />
        {field.label}
      </label>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: "var(--text)" }}>
        {field.label}
        {field.unit && <span className="ml-1 font-normal" style={{ color: "var(--text-muted)" }}>({field.unit})</span>}
      </label>

      {field.type === "select" || field.type === "unitSelect" ? (
        <select
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          className="h-11 rounded-xl border px-3 text-sm"
          style={{ background: "var(--surface)", borderColor: error ? "var(--color-rose-500)" : "var(--border)", color: "var(--text)" }}
        >
          {resolvedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          id={id}
          value={value ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.id, e.target.value)}
          rows={5}
          className="rounded-xl border px-3 py-2.5 text-sm font-mono"
          style={{ background: "var(--surface)", borderColor: error ? "var(--color-rose-500)" : "var(--border)", color: "var(--text)" }}
        />
      ) : (
        <input
          id={id}
          type={field.type === "number" ? "number" : field.type || "text"}
          inputMode={field.type === "number" ? "decimal" : undefined}
          step={field.step || "any"}
          value={value ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.id, e.target.value)}
          className="h-11 rounded-xl border px-3 text-sm tabular-nums"
          style={{ background: "var(--surface)", borderColor: error ? "var(--color-rose-500)" : "var(--border)", color: "var(--text)" }}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs" style={{ color: "var(--color-rose-500)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
