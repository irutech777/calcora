import { useState } from "react";
import { Navigate } from "react-router-dom";
import { CATEGORIES } from "../data/categories.js";
import { getCalculatorsByCategory } from "../data/calculatorConfig.js";
import { getFavorites, toggleFavorite } from "../utils/storage.js";
import Seo from "../components/Seo.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import CalculatorCard from "../components/CalculatorCard.jsx";
import AdPlaceholder from "../components/AdPlaceholder.jsx";
import Icon from "../components/Icon.jsx";

export default function CategoryPage({ categorySlug }) {
  const category = CATEGORIES[categorySlug];
  const [favorites, setFavorites] = useState(getFavorites());

  if (!category) return <Navigate to="/404" replace />;

  const calculators = getCalculatorsByCategory(categorySlug);

  function handleToggleFavorite(slug) {
    setFavorites(toggleFavorite(slug));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Seo
        title={`${category.label} Calculators`}
        description={`Free online ${category.label.toLowerCase()} calculators: ${category.description}`}
        path={`/${categorySlug}`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: category.label, href: `/${categorySlug}` }]}
      />

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: category.label, href: `/${categorySlug}` }]} />

      <header className="mb-8 flex items-center gap-4">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl shrink-0"
          style={{ background: "var(--color-signal-100)", color: "var(--color-signal-600)" }}
        >
          <Icon name={category.icon} className="w-7 h-7" />
        </span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
            {category.label} Calculators
          </h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>{category.description}</p>
        </div>
      </header>

      <AdPlaceholder position="top" className="mb-8" />

      {calculators.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>More calculators in this category are coming soon.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((c) => (
            <CalculatorCard key={c.slug} calculator={c} isFavorite={favorites.includes(c.slug)} onToggleFavorite={handleToggleFavorite} />
          ))}
        </div>
      )}

      <AdPlaceholder position="bottom" className="mt-10" />
    </div>
  );
}
