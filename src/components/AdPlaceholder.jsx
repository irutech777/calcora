// Dedicated, clearly-labelled ad slots so real AdSense units can be dropped
// in later without shifting layout or risking accidental clicks. Kept far
// from interactive controls per AdSense placement policy.
export default function AdPlaceholder({ position = "content", className = "" }) {
  const sizes = {
    top: "h-24",
    content: "h-28",
    sidebar: "h-64",
    bottom: "h-24",
  };
  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-dashed text-xs ${sizes[position] || "h-24"} ${className}`}
      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      aria-hidden="true"
      data-ad-slot={position}
    >
      Advertisement space ({position})
    </div>
  );
}
