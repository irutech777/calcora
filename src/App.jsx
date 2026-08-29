import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { useTheme } from "./hooks/useTheme.js";

const Home = lazy(() => import("./pages/Home.jsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.jsx"));
const CalculatorPage = lazy(() => import("./pages/CalculatorPage.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Terms = lazy(() => import("./pages/Terms.jsx"));
const Disclaimer = lazy(() => import("./pages/Disclaimer.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="h-8 w-8 rounded-full border-2 animate-spin" style={{ borderColor: "var(--border)", borderTopColor: "var(--color-signal-600)" }} />
    </div>
  );
}

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/finance" element={<CategoryPage categorySlug="finance" />} />
            <Route path="/math" element={<CategoryPage categorySlug="math" />} />
            <Route path="/health" element={<CategoryPage categorySlug="health" />} />
            <Route path="/education" element={<CategoryPage categorySlug="education" />} />
            <Route path="/daily-life" element={<CategoryPage categorySlug="daily-life" />} />
            <Route path="/developer-tools" element={<CategoryPage categorySlug="developer-tools" />} />
            <Route path="/calculators/:slug" element={<CalculatorPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
