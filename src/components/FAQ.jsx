import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ({ faqs, title = "Frequently Asked Questions" }) {
  const [openIndex, setOpenIndex] = useState(0);
  if (!faqs || faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-10">
      <h2 id="faq-heading" className="text-xl font-semibold mb-4" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
        {title}
      </h2>
      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} style={{ borderColor: "var(--border)" }}>
              <h3>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                >
                  <span className="font-medium text-sm sm:text-base" style={{ color: "var(--text)" }}>{faq.q}</span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 transition-transform"
                    style={{ color: "var(--text-muted)", transform: isOpen ? "rotate(180deg)" : "none" }}
                  />
                </button>
              </h3>
              {isOpen && (
                <div id={`faq-panel-${i}`} className="px-5 pb-4 text-sm" style={{ color: "var(--text-muted)" }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
