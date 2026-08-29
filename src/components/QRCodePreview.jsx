import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

// Renders a QR code entirely client-side (no backend, no external API calls)
// using the qrcode package, and offers a PNG download.
export default function QRCodePreview({ text }) {
  const canvasRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!text || !text.trim()) {
      setError("Please enter some text or a URL.");
      return;
    }
    setError("");
    QRCode.toCanvas(canvasRef.current, text, { width: 220, margin: 1, color: { dark: "#0f1622", light: "#ffffff" } }).catch(() =>
      setError("Could not generate a QR code for that input.")
    );
  }, [text]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "irucalc-qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="lcd-panel p-6 flex flex-col items-center gap-4">
      <p className="text-xs uppercase tracking-wider opacity-70 self-start">Result</p>
      {error ? (
        <p className="text-sm opacity-80 py-10">{error}</p>
      ) : (
        <>
          <div className="rounded-xl overflow-hidden bg-white p-2">
            <canvas ref={canvasRef} />
          </div>
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
          >
            <Download className="w-3.5 h-3.5" /> Download PNG
          </button>
        </>
      )}
    </div>
  );
}
