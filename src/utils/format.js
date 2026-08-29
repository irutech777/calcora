// Shared, dependency-free formatting helpers used across every calculator.

export function formatCurrency(value, { currency = "INR", maximumFractionDigits = 0 } = {}) {
  if (!isFinite(value)) return "—";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits,
    }).format(value);
  } catch {
    return `₹${formatNumber(value, maximumFractionDigits)}`;
  }
}

export function formatNumber(value, maximumFractionDigits = 2) {
  if (!isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits }).format(value);
}

export function formatPercent(value, digits = 2) {
  if (!isFinite(value)) return "—";
  return `${formatNumber(value, digits)}%`;
}

export function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
