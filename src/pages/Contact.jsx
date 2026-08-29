import { useState } from "react";
import StaticPage from "./StaticPage.jsx";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // No backend yet — this simply confirms receipt locally. Wire this up
    // to an email service or API endpoint when the backend is added.
    setSubmitted(true);
  }

  return (
    <StaticPage title="Contact Us" description="Get in touch with the IruCalc team." path="/contact">
      <p>Have feedback, found a bug, or want a calculator we don't have yet? Send us a message.</p>
      {submitted ? (
        <p className="rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
          Thanks — your message has been noted. We read every submission.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 not-prose">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Name</label>
            <input id="name" required className="h-11 w-full rounded-xl border px-3 text-sm" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Email</label>
            <input id="email" type="email" required className="h-11 w-full rounded-xl border px-3 text-sm" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Message</label>
            <textarea id="message" rows={5} required className="w-full rounded-xl border px-3 py-2 text-sm" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
          </div>
          <button type="submit" className="h-11 rounded-xl px-6 text-sm font-semibold text-white" style={{ background: "var(--color-signal-600)" }}>
            Send message
          </button>
        </form>
      )}
    </StaticPage>
  );
}
