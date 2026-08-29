import { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { RotateCcw, AlertCircle } from "lucide-react";
import { getCalculatorBySlug, CALCULATORS } from "../data/calculatorConfig.js";
import { UNIT_CATEGORIES } from "../calculators/math/mathCalc.js";
import { CATEGORIES } from "../data/categories.js";
import Seo from "../components/Seo.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import InputField from "../components/InputField.jsx";
import ResultCard from "../components/ResultCard.jsx";
import QRCodePreview from "../components/QRCodePreview.jsx";
import FAQ from "../components/FAQ.jsx";
import AdPlaceholder from "../components/AdPlaceholder.jsx";
import CalculatorCard from "../components/CalculatorCard.jsx";
import { DonutChart, LineChart } from "../components/MiniChart.jsx";
import { getFavorites, toggleFavorite, pushRecent, getHistory, pushHistory } from "../utils/storage.js";

function buildDefaults(fields) {
  const values = {};
  for (const f of fields) values[f.id] = f.defaultValue ?? "";
  return values;
}

export default function CalculatorPage() {
  const { slug } = useParams();
  const calculator = getCalculatorBySlug(slug);
  const fields = calculator?.fields || [];

  const [values, setValues] = useState(() => buildDefaults(fields));
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(getFavorites());
  const [history, setHistory] = useState(() => getHistory(slug));

  // Reset local state whenever the user navigates to a different calculator.
  useEffect(() => {
    if (!calculator) return;
    setValues(buildDefaults(calculator.fields));
    setResult(null);
    setError("");
    setHistory(getHistory(slug));
    pushRecent(slug);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep unit-converter "from"/"to" selects valid whenever the category changes.
  useEffect(() => {
    if (calculator?.slug === "unit-converter") {
      const units = Object.keys(UNIT_CATEGORIES[values.category]?.units || {});
      setValues((v) => ({
        ...v,
        from: units.includes(v.from) ? v.from : units[0],
        to: units.includes(v.to) ? v.to : units[1] || units[0],
      }));
    }
  }, [values.category, calculator?.slug]);

  if (!calculator) return <Navigate to="/404" replace />;

  const isQR = calculator.slug === "qr-code-generator";

  function handleChange(id, value) {
    setValues((v) => ({ ...v, [id]: value }));
    if (isQR) setError(""); // QR renders live, no submit button needed
  }

  function handleCalculate(e) {
    e?.preventDefault();
    try {
      const output = calculator.compute(values);
      setResult(output);
      setError("");
      const historyEntry = { inputs: { ...values }, summary: output.results?.[0] };
      setHistory(pushHistory(slug, historyEntry));
    } catch (err) {
      setError(err.message || "Please check your inputs and try again.");
      setResult(null);
    }
  }

  function handleReset() {
    setValues(buildDefaults(calculator.fields));
    setResult(null);
    setError("");
  }

  const isFavorite = favorites.includes(slug);
  function handleToggleFavorite() {
    setFavorites(toggleFavorite(slug));
  }

  const category = CATEGORIES[calculator.category];
  const related = useMemo(
    () => (calculator.related || []).map((s) => CALCULATORS.find((c) => c.slug === s)).filter(Boolean),
    [calculator]
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: category?.label || "Calculators", href: `/${calculator.category}` },
    { label: calculator.name, href: `/calculators/${calculator.slug}` },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <Seo
        title={calculator.name}
        description={calculator.description}
        path={`/calculators/${calculator.slug}`}
        faqs={calculator.faqs}
        breadcrumbs={breadcrumbItems}
      />

      <Breadcrumb items={breadcrumbItems} />

      <AdPlaceholder position="top" className="mb-6" />

      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          {calculator.name}
        </h1>
        <p className="mt-2 max-w-2xl" style={{ color: "var(--text-muted)" }}>{calculator.description}</p>
        {calculator.disclaimer && (
          <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            These calculators are for informational purposes only and are not medical advice.
          </p>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 card p-5 sm:p-6">
          <form onSubmit={handleCalculate} className="space-y-4" noValidate>
            {calculator.fields.map((field) => {
              const visible = field.showIf ? field.showIf(values) : true;
              if (!visible) return null;
              const dynamicOptions =
                field.type === "unitSelect"
                  ? Object.keys(UNIT_CATEGORIES[values.category]?.units || {}).map((u) => ({ value: u, label: u }))
                  : undefined;
              return (
                <InputField
                  key={field.id}
                  field={field}
                  value={values[field.id]}
                  onChange={handleChange}
                  options={dynamicOptions}
                />
              );
            })}

            {error && (
              <p className="flex items-center gap-2 text-sm" role="alert" style={{ color: "var(--color-rose-500)" }}>
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </p>
            )}

            {!isQR && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="h-11 flex-1 min-w-[140px] rounded-xl px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "var(--color-signal-600)" }}
                >
                  Calculate
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-11 inline-flex items-center gap-1.5 rounded-xl border px-4 text-sm font-medium"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="h-11 rounded-xl border px-4 text-sm font-medium"
                  style={{ borderColor: "var(--border)", color: isFavorite ? "var(--color-amber-500)" : "var(--text)" }}
                >
                  {isFavorite ? "★ Favorited" : "☆ Favorite"}
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {isQR ? (
            <QRCodePreview text={values.text} />
          ) : result ? (
            <ResultCard results={result.results} shareText={`${calculator.name} result from IruCalc`} />
          ) : (
            <div className="card p-6 text-sm" style={{ color: "var(--text-muted)" }}>
              Enter your details and press <strong>Calculate</strong> to see your result here.
            </div>
          )}

          {result?.chart?.type === "donut" && (
            <div className="card p-5">
              <DonutChart data={result.chart.data} />
            </div>
          )}
          {result?.chart?.type === "line" && (
            <div className="card p-5">
              <LineChart data={result.chart.data} />
            </div>
          )}

          <AdPlaceholder position="sidebar" />
        </div>
      </div>

      <article className="mt-10 max-w-3xl space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
            What is {calculator.name.replace(" Calculator", "")}?
          </h2>
          <p style={{ color: "var(--text-muted)" }}>{calculator.whatIs}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
            How it's calculated
          </h2>
          <p style={{ color: "var(--text-muted)" }}>{calculator.howItWorks}</p>
          <p className="mt-3 rounded-xl border px-4 py-3 font-mono text-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            {calculator.formula}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>Example</h3>
          <p style={{ color: "var(--text-muted)" }}>{calculator.example}</p>
        </section>

        <AdPlaceholder position="content" />

        <FAQ faqs={calculator.faqs} />
      </article>

      {history.length > 0 && (
        <section className="mt-10 max-w-3xl">
          <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>Your recent calculations</h2>
          <ul className="card divide-y text-sm" style={{ borderColor: "var(--border)" }}>
            {history.slice(0, 5).map((h, i) => (
              <li key={i} className="flex items-center justify-between px-4 py-2.5" style={{ color: "var(--text-muted)" }}>
                <span>{new Date(h.ts).toLocaleString()}</span>
                <span style={{ color: "var(--text)" }}>{h.summary?.value ?? "—"}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text)" }}>Related calculators</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CalculatorCard key={c.slug} calculator={c} />
            ))}
          </div>
        </section>
      )}

      <AdPlaceholder position="bottom" className="mt-10" />
    </div>
  );
}
