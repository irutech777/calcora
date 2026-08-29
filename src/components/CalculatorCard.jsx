import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import Icon from "./Icon.jsx";

export default function CalculatorCard({ calculator, isFavorite, onToggleFavorite }) {
  return (
    <div className="card group relative flex flex-col gap-3 p-5 transition-transform hover:-translate-y-0.5">
      {onToggleFavorite && (
        <button
          type="button"
          onClick={() => onToggleFavorite(calculator.slug)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          className="absolute top-4 right-4"
        >
          <Star
            className="w-4 h-4"
            fill={isFavorite ? "var(--color-amber-500)" : "none"}
            style={{ color: isFavorite ? "var(--color-amber-500)" : "var(--text-muted)" }}
          />
        </button>
      )}
      <Link to={`/calculators/${calculator.slug}`} className="flex flex-col gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: "var(--color-signal-100)", color: "var(--color-signal-600)" }}
        >
          <Icon name={calculator.icon} className="w-5 h-5" />
        </span>
        <div>
          <h3 className="font-semibold pr-6" style={{ color: "var(--text)" }}>{calculator.name}</h3>
          <p className="mt-1 text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>{calculator.description}</p>
        </div>
      </Link>
    </div>
  );
}
