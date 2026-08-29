import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import SearchBar from "../components/SearchBar.jsx";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <Seo title="Page Not Found" description="This page could not be found." path="/404" />
      <p className="text-6xl font-semibold mb-2" style={{ color: "var(--color-signal-600)", fontFamily: "var(--font-display)" }}>404</p>
      <h1 className="text-2xl font-semibold mb-3" style={{ color: "var(--text)" }}>We couldn't find that calculator</h1>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>Try searching for what you need, or head back home.</p>
      <div className="max-w-sm mx-auto mb-6">
        <SearchBar />
      </div>
      <Link to="/" className="text-sm font-medium" style={{ color: "var(--color-signal-600)" }}>← Back to homepage</Link>
    </div>
  );
}
