function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function percentOf({ percent, of }) {
  const p = Number(percent);
  const n = Number(of);
  if (!isFinite(p) || !isFinite(n)) throw new Error("Please enter valid numbers.");
  return { result: round2((p / 100) * n) };
}

export function whatPercent({ part, whole }) {
  const p = Number(part);
  const w = Number(whole);
  if (!isFinite(p) || !isFinite(w)) throw new Error("Please enter valid numbers.");
  if (w === 0) throw new Error("The 'whole' value cannot be zero.");
  return { result: round2((p / w) * 100) };
}

export function percentChange({ from, to }) {
  const a = Number(from);
  const b = Number(to);
  if (!isFinite(a) || !isFinite(b)) throw new Error("Please enter valid numbers.");
  if (a === 0) throw new Error("The starting value cannot be zero.");
  const change = ((b - a) / Math.abs(a)) * 100;
  return { result: round2(change), direction: change >= 0 ? "increase" : "decrease" };
}

export function profitLoss({ costPrice, sellingPrice }) {
  const cp = Number(costPrice);
  const sp = Number(sellingPrice);
  if (!(cp > 0)) throw new Error("Please enter a valid cost price.");
  if (!(sp >= 0)) throw new Error("Please enter a valid selling price.");
  const diff = sp - cp;
  const percent = (Math.abs(diff) / cp) * 100;
  return {
    isProfit: diff >= 0,
    amount: round2(Math.abs(diff)),
    percent: round2(percent),
  };
}

export function discount({ mrp, discountPercent }) {
  const m = Number(mrp);
  const d = Number(discountPercent);
  if (!(m > 0)) throw new Error("Please enter a valid price.");
  if (!(d >= 0 && d <= 100)) throw new Error("Discount must be between 0 and 100%.");
  const saved = (m * d) / 100;
  return { finalPrice: round2(m - saved), amountSaved: round2(saved) };
}

export function ratioSimplify({ a, b }) {
  const x = Number(a);
  const y = Number(b);
  if (!(x >= 0) || !(y >= 0)) throw new Error("Please enter valid, non-negative numbers.");
  if (x === 0 && y === 0) throw new Error("Both values cannot be zero.");
  const gcd = (m, n) => (n === 0 ? m : gcd(n, m % n));
  const g = gcd(Math.round(x), Math.round(y)) || 1;
  return { simplified: `${Math.round(x) / g} : ${Math.round(y) / g}`, decimal: round2(y === 0 ? Infinity : x / y) };
}

export function average({ numbers }) {
  const list = numbers
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number);
  if (list.length === 0 || list.some((n) => !isFinite(n))) {
    throw new Error("Please enter a valid, comma-separated list of numbers.");
  }
  const sum = list.reduce((a, b) => a + b, 0);
  const sorted = [...list].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return {
    count: list.length,
    sum: round2(sum),
    average: round2(sum / list.length),
    min: Math.min(...list),
    max: Math.max(...list),
    median: round2(median),
  };
}

export function fractionSimplify({ numerator, denominator }) {
  const n = Number(numerator);
  const d = Number(denominator);
  if (!Number.isInteger(n) || !Number.isInteger(d)) throw new Error("Please enter whole numbers.");
  if (d === 0) throw new Error("Denominator cannot be zero.");
  const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const g = gcd(n, d) || 1;
  const sign = d < 0 ? -1 : 1;
  return {
    simplified: `${(sign * n) / g}/${Math.abs(d) / g}`,
    decimal: round2(n / d),
  };
}

export function ageFromDate({ dob, asOf }) {
  const birth = new Date(dob);
  const reference = asOf ? new Date(asOf) : new Date();
  if (isNaN(birth.getTime())) throw new Error("Please enter a valid date of birth.");
  if (birth > reference) throw new Error("Date of birth cannot be in the future.");

  let years = reference.getFullYear() - birth.getFullYear();
  let months = reference.getMonth() - birth.getMonth();
  let days = reference.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(reference.getFullYear(), reference.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((reference - birth) / (1000 * 60 * 60 * 24));
  return { years, months, days, totalDays };
}

export function dateDifference({ start, end }) {
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) throw new Error("Please enter valid dates.");
  const ms = e - s;
  const totalDays = Math.round(ms / (1000 * 60 * 60 * 24));
  return {
    totalDays: Math.abs(totalDays),
    weeks: Math.floor(Math.abs(totalDays) / 7),
    isPast: ms < 0,
  };
}

export function timeDuration({ startTime, endTime }) {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  if ([sh, sm, eh, em].some((v) => isNaN(v))) throw new Error("Please enter valid times.");
  let startMinutes = sh * 60 + sm;
  let endMinutes = eh * 60 + em;
  let diff = endMinutes - startMinutes;
  if (diff < 0) diff += 24 * 60;
  return { hours: Math.floor(diff / 60), minutes: diff % 60, totalMinutes: diff };
}

// ---- Unit conversion ----
export const UNIT_CATEGORIES = {
  length: {
    label: "Length",
    units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mile: 1609.344, yard: 0.9144, foot: 0.3048, inch: 0.0254 },
  },
  weight: {
    label: "Weight",
    units: { kg: 1, g: 0.001, mg: 0.000001, tonne: 1000, pound: 0.453592, ounce: 0.0283495 },
  },
  temperature: { label: "Temperature", units: { celsius: "c", fahrenheit: "f", kelvin: "k" } },
  volume: {
    label: "Volume",
    units: { liter: 1, ml: 0.001, gallon: 3.78541, cup: 0.24, tablespoon: 0.0147868, teaspoon: 0.00492892 },
  },
};

export function convertUnit({ category, from, to, value }) {
  const v = Number(value);
  if (!isFinite(v)) throw new Error("Please enter a valid number.");
  const cat = UNIT_CATEGORIES[category];
  if (!cat) throw new Error("Unknown category.");

  if (category === "temperature") {
    return { result: round2(convertTemperature(v, from, to)) };
  }

  const base = v * cat.units[from];
  const result = base / cat.units[to];
  return { result: round2(result) };
}

function convertTemperature(value, from, to) {
  let celsius;
  if (from === "celsius") celsius = value;
  else if (from === "fahrenheit") celsius = ((value - 32) * 5) / 9;
  else celsius = value - 273.15;

  if (to === "celsius") return celsius;
  if (to === "fahrenheit") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

// Static reference rates (approx, mid-2025) so the converter works fully
// offline with no backend. Swap `RATES` for a live API later without
// touching the UI — see README for wiring instructions.
export const CURRENCY_RATES_BASE_USD = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  AUD: 1.52,
  CAD: 1.36,
  AED: 3.67,
  SGD: 1.34,
};

export function convertCurrency({ amount, from, to }) {
  const a = Number(amount);
  if (!(a >= 0)) throw new Error("Please enter a valid amount.");
  const rates = CURRENCY_RATES_BASE_USD;
  if (!rates[from] || !rates[to]) throw new Error("Unsupported currency.");
  const usd = a / rates[from];
  const result = usd * rates[to];
  return { result: round2(result), rate: round2(rates[to] / rates[from]) };
}
