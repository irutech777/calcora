# IruCalc — Free Online Calculators

A fast, mobile-first React + Vite + Tailwind website with 40+ client-side calculators across
Finance, Math, Health, Education and Developer Tools. No backend, no login — every calculation
runs in the browser.

## Quick start

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

```bash
npm run build     # production build to dist/, also regenerates sitemap.xml
npm run preview   # preview the production build locally
npm run generate-sitemap  # regenerate public/sitemap.xml on its own
```

## Tech stack

- **React 19 + Vite** — app shell, lazy-loaded routes
- **React Router** — client-side routing (`/calculators/:slug`, category pages, static pages)
- **Tailwind CSS v4** — design tokens defined in `src/index.css` (`@theme` block)
- **lucide-react** — icons, imported by name only (see `src/components/Icon.jsx`) to keep the
  bundle small
- **qrcode** — the only calculator-specific dependency, used solely by the QR Code Generator

No state management library, no chart library, no UI kit — result panels, donut/line charts and
form controls are all hand-built to keep the bundle lean.

## Project structure

```
src/
├── components/     Reusable UI: Header, Footer, CalculatorCard, InputField, ResultCard,
│                   CalculatorLayout pieces, CategoryCard, SearchBar, FAQ, Breadcrumb,
│                   AdPlaceholder, ShareButton, Seo, MiniChart, Icon, ThemeToggle
├── pages/          Route-level pages: Home, CategoryPage, CalculatorPage (generic, config
│                   driven), About, Contact, Privacy, Terms, Disclaimer, NotFound
├── calculators/    Pure calculation functions, one file per category, zero UI code:
│   ├── finance/financeMath.js
│   ├── math/mathCalc.js
│   ├── health/healthCalc.js
│   ├── education/educationCalc.js
│   └── developer/developerCalc.js
├── data/
│   ├── calculatorConfig.js   The central registry — every calculator's fields, compute
│   │                         function, formula, FAQ content and related calculators
│   └── categories.js         Category metadata (label, icon, description)
├── utils/          format.js (currency/number formatting), storage.js (localStorage helpers)
├── hooks/          useTheme, useDebounce, useLocalStorageList
├── App.jsx         Route table
└── main.jsx        Entry point, service worker registration
```

## Adding a new calculator

This is the one workflow the whole architecture is built around, and it never requires
touching a page component:

1. Write a pure function in the right `src/calculators/<category>/*.js` file. It should throw
   a plain `Error("Please enter a valid ...")` for invalid input and return a plain object of
   numbers.
2. Add one entry to the `CALCULATORS` array in `src/data/calculatorConfig.js`: `slug`, `name`,
   `category`, `icon` (any lucide-react name — then add it to `src/components/Icon.jsx`'s
   import list), `fields` (see existing entries for the field schema), a `compute(values)`
   function that calls your pure function and maps the result into `{ results, chart? }`, and
   the educational content (`whatIs`, `howItWorks`, `formula`, `example`, `faqs`, `related`).
3. That's it — the calculator automatically gets a route (`/calculators/<slug>`), shows up in
   its category page, is searchable, gets SEO meta tags + FAQ structured data, and supports
   favorites/history/share/print out of the box.

## Data & privacy

- No backend, no analytics wired in by default, no account system.
- Favorites, recently-used calculators and per-calculator history live only in the browser's
  `localStorage` (see `src/utils/storage.js`) — nothing is sent anywhere.
- The Currency Converter uses a static reference rate table (`CURRENCY_RATES_BASE_USD` in
  `src/calculators/math/mathCalc.js`) so it works fully offline. Swap it for a live rates API
  when a backend exists.
- The Income Tax Calculator's slabs live in one exported constant
  (`INCOME_TAX_SLABS_NEW_REGIME` in `src/calculators/finance/financeMath.js`) so they can be
  updated each budget without touching any calculation or UI code.

## SEO

Because this is a pure client-side SPA (no SSR), `src/components/Seo.jsx` sets `<title>`, meta
description, canonical URL, Open Graph tags, and FAQ/Breadcrumb JSON-LD structured data on every
route change. `npm run build` regenerates `public/sitemap.xml` from the calculator registry, and
`public/robots.txt` points to it. For best search-engine results in production, consider adding
server-side rendering or pre-rendering (e.g. `vite-plugin-ssr`, Astro, or a prerender service) —
the current setup is a solid client-rendered baseline that already ships full metadata and
structured data per page.

## AdSense readiness

`src/components/AdPlaceholder.jsx` renders clearly labelled, fixed-size slots (`top`, `content`,
`sidebar`, `bottom`) already placed on the homepage, category pages and every calculator page,
positioned away from interactive controls to avoid accidental clicks. Swap the placeholder's
contents for real AdSense `<ins>` tags once you have a publisher ID.

## PWA / offline

`public/manifest.json`, `public/sw.js` (hand-written, no Workbox) and the icons in
`public/icons/` make the site installable and cache the app shell so previously-visited
calculators keep working offline. The service worker only registers in production builds.

## Backend readiness

There is no backend today — all calculations are pure functions run client-side. If/when a
Spring Boot (or any) backend is added, the natural seams are: swapping `convertCurrency`'s
static rate table for a live-rates endpoint, moving `INCOME_TAX_SLABS_NEW_REGIME` to a
config API, and optionally syncing `localStorage` favorites/history to an account.
