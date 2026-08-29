import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

export default function CategoryCard({ category, count }) {
  return (
    <Link
      to={`/${category.slug}`}
      className="card group flex flex-col gap-3 p-5 transition-transform hover:-translate-y-0.5"
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: "var(--color-signal-100)", color: "var(--color-signal-600)" }}
      >
        <Icon name={category.icon} className="w-5 h-5" />
      </span>
      <div>
        <h3 className="font-semibold" style={{ color: "var(--text)" }}>{category.label}</h3>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{category.description}</p>
      </div>
      {typeof count === "number" && (
        <span className="text-xs font-medium mt-auto" style={{ color: "var(--color-signal-600)" }}>
          {count} calculators →
        </span>
      )}
    </Link>
  );
}
