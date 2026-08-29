export const BASES = { binary: 2, octal: 8, decimal: 10, hexadecimal: 16 };

export function convertBase({ value, fromBase, toBase }) {
  const from = BASES[fromBase] ?? Number(fromBase);
  const to = BASES[toBase] ?? Number(toBase);
  const cleaned = String(value).trim();

  if (!cleaned) throw new Error("Please enter a value to convert.");
  const valid = /^[0-9a-fA-F]+$/.test(cleaned);
  if (!valid) throw new Error("Please enter a valid value using digits 0-9 and letters A-F.");

  const parsed = parseInt(cleaned, from);
  if (isNaN(parsed)) throw new Error(`"${value}" is not valid in base ${from}.`);

  return {
    result: parsed.toString(to).toUpperCase(),
    decimalValue: parsed,
    binary: parsed.toString(2),
    octal: parsed.toString(8),
    hexadecimal: parsed.toString(16).toUpperCase(),
  };
}

export function formatJSON({ input, indent = 2 }) {
  if (!input || !input.trim()) throw new Error("Please paste some JSON to format.");
  try {
    const parsed = JSON.parse(input);
    return { formatted: JSON.stringify(parsed, null, Number(indent)), minified: JSON.stringify(parsed), valid: true };
  } catch (e) {
    throw new Error(`Invalid JSON: ${e.message}`);
  }
}

export function unixToDate({ timestamp, unit = "seconds" }) {
  const ts = Number(timestamp);
  if (!isFinite(ts)) throw new Error("Please enter a valid Unix timestamp.");
  const ms = unit === "milliseconds" ? ts : ts * 1000;
  const date = new Date(ms);
  if (isNaN(date.getTime())) throw new Error("That timestamp is out of range.");
  return {
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
  };
}

export function dateToUnix({ dateString }) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) throw new Error("Please enter a valid date.");
  return { seconds: Math.floor(date.getTime() / 1000), milliseconds: date.getTime() };
}

export function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return { uuid: crypto.randomUUID() };
  }
  // Fallback (RFC4122 v4) for very old browsers.
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return { uuid };
}

export function generatePassword({ length = 16, uppercase = true, lowercase = true, numbers = true, symbols = true }) {
  const len = Math.min(128, Math.max(4, Number(length) || 16));
  const sets = [];
  if (uppercase) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (lowercase) sets.push("abcdefghijklmnopqrstuvwxyz");
  if (numbers) sets.push("0123456789");
  if (symbols) sets.push("!@#$%^&*()_+-=[]{}|;:,.<>?");

  if (sets.length === 0) throw new Error("Select at least one character type.");

  const all = sets.join("");
  const randomValues = new Uint32Array(len);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    for (let i = 0; i < len; i++) randomValues[i] = Math.floor(Math.random() * 4294967295);
  }

  let password = "";
  // Guarantee at least one char from each selected set, then fill the rest.
  sets.forEach((set, i) => {
    password += set[randomValues[i] % set.length];
  });
  for (let i = sets.length; i < len; i++) {
    password += all[randomValues[i] % all.length];
  }
  // Shuffle
  password = password
    .split("")
    .sort(() => (typeof crypto !== "undefined" ? crypto.getRandomValues(new Uint32Array(1))[0] % 2 - 0.5 : Math.random() - 0.5))
    .join("");

  let strength = "Weak";
  if (len >= 12 && sets.length >= 3) strength = "Strong";
  else if (len >= 8 && sets.length >= 2) strength = "Medium";

  return { password, strength };
}
