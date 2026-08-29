import Seo from "../components/Seo.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

export default function StaticPage({ title, description, path, children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Seo title={title} description={description} path={path} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: title, href: path }]} />
      <h1 className="text-3xl font-semibold tracking-tight mb-6" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
        {title}
      </h1>
      <div className="prose-content space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {children}
      </div>
    </div>
  );
}
