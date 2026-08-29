import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CALCULATORS, POPULAR_SLUGS } from "../data/calculatorConfig.js";
import { CATEGORY_LIST } from "../data/categories.js";
import { getFavorites, getRecents, toggleFavorite } from "../utils/storage.js";
import Seo from "../components/Seo.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import CalculatorCard from "../components/CalculatorCard.jsx";
import FAQ from "../components/FAQ.jsx";
import AdPlaceholder from "../components/AdPlaceholder.jsx";

const HOME_FAQS = [
  { q: "Is Calcora really free to use?", a: "Yes — every calculator on Calcora is completely free, with no sign-up and no limits on how many times you can use them." },
  { q: "Do I need an account?", a: "No. Favorites, recent calculators and history are saved locally in your browser using localStorage — there's no login and no data sent to a server." },
  { q: "Does Calcora work offline?", a: "Once loaded, most calculators keep working without an internet connection, since every calculation happens on your device." },
  { q: "How accurate are the results?", a: "Calculations use standard, widely-used financial and mathematical formulas. For health calculators, results are estimates for informational purposes, not medical advice." },
];

export default function Home() {
  const [favorites, setFavorites] = useState(getFavorites());
  const recents = useMemo(() => getRecents().map((slug) => CALCULATORS.find((c) => c.slug === slug)).filter(Boolean), []);
  const popular = useMemo(() => POPULAR_SLUGS.map((slug) => CALCULATORS.find((c) => c.slug === slug)).filter(Boolean), []);

  function handleToggleFavorite(slug) {
    setFavorites(toggleFavorite(slug));
  }

  return (
    <div>
      <Seo
        title={null}
        description="Calcora offers free, accurate online calculators for EMI, SIP, GST, BMI, percentage, salary, age and 40+ everyday calculations."
        path="/"
      />

      {/* Hero */}
      <section className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1
            className="text-4xl sm:text-5xl font-semibold tracking-tight"
            style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}
          >
            Free Online Calculators
          </h1>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Calculate EMI, SIP, GST, BMI, percentages, salary and much more — quickly and accurately.
          </p>
          <div className="mt-8 max-w-xl mx-auto">
            <SearchBar variant="hero" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlaceholder position="top" className="mt-8" />

        {/* Popular calculators */}
        <section className="mt-12">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-semibold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
              Popular calculators
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((c) => (
              <CalculatorCard key={c.slug} calculator={c} isFavorite={favorites.includes(c.slug)} onToggleFavorite={handleToggleFavorite} />
            ))}
          </div>
        </section>

        {/* Recently used */}
        {recents.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
              Recently used
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recents.map((c) => (
                <CalculatorCard key={c.slug} calculator={c} isFavorite={favorites.includes(c.slug)} onToggleFavorite={handleToggleFavorite} />
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
            Browse by category
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_LIST.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} count={CALCULATORS.filter((c) => c.category === cat.slug).length} />
            ))}
          </div>
        </section>

        <AdPlaceholder position="content" className="mt-12" />

        {/* How it works */}
        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
            How it works
          </h2>
          <ol className="space-y-3 text-sm" style={{ color: "var(--text-muted)" }}>
            <li><strong style={{ color: "var(--text)" }}>1. Pick a calculator.</strong> Search by name or browse a category — there are over 40 to choose from.</li>
            <li><strong style={{ color: "var(--text)" }}>2. Enter your numbers.</strong> Every field is validated as you type, so mistakes are caught early.</li>
            <li><strong style={{ color: "var(--text)" }}>3. Get an instant result.</strong> All math runs in your browser — nothing is uploaded anywhere.</li>
          </ol>
        </section>

        {/* SEO content */}
        <section className="mt-12 max-w-3xl space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
              What is an online calculator?
            </h2>
            <p style={{ color: "var(--text-muted)" }}>
              An online calculator is a web-based tool that performs a specific calculation — like a loan EMI, a BMI score,
              or a percentage — using a formula built into the page, so you get an answer without doing the math by hand
              or opening a spreadsheet.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
              Why use Calcora?
            </h2>
            <p style={{ color: "var(--text-muted)" }}>
              Calcora brings together the calculators people reach for most often — finance, math, health, education and
              developer tools — in one fast, ad-light, mobile-friendly place, with every calculation explained alongside
              the result rather than left as a mystery number.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
              How our calculators work
            </h2>
            <p style={{ color: "var(--text-muted)" }}>
              Each calculator uses a standard, published formula — the same ones used in textbooks, banking documents or
              medical references. Every result page shows the formula and a worked example so you can verify the
              calculation yourself.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
              Are online calculator results accurate?
            </h2>
            <p style={{ color: "var(--text-muted)" }}>
              Yes, for the formulas they implement — the math itself is exact. Health calculators are estimates based on
              established equations, and financial calculators generally assume flat rates over the full period, so
              real-world results (which include fees, taxes or rate changes) may differ slightly.
            </p>
          </div>
        </section>

        <FAQ faqs={HOME_FAQS} title="Frequently asked questions" />

        <AdPlaceholder position="bottom" className="my-12" />
      </div>
    </div>
  );
}
