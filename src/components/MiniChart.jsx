const COLORS = ["#2454ff", "#00c896", "#f5a524", "#f04a5e"];

export function DonutChart({ data, size = 160 }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Breakdown chart">
        <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
          <circle r={radius} fill="none" stroke="var(--surface-2)" strokeWidth="16" />
          {data.map((d, i) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const circle = (
              <circle
                key={i}
                r={radius}
                fill="none"
                stroke={COLORS[i % COLORS.length]}
                strokeWidth="16"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return circle;
          })}
        </g>
      </svg>
      <ul className="text-sm space-y-1.5">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span style={{ color: "var(--text-muted)" }}>{d.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LineChart({ data, height = 180 }) {
  if (!data || data.length === 0) return null;
  const width = 480;
  const padding = 24;
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = 0;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / (max - min || 1)) * (height - padding * 2);
    return [x, y];
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const areaPath = `${path} L${points[points.length - 1][0]},${height - padding} L${points[0][0]},${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Growth chart">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2454ff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2454ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#lineFill)" />
      <path d={path} fill="none" stroke="#2454ff" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#2454ff" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={points[i][0]} y={height - 4} fontSize="10" textAnchor="middle" fill="var(--text-muted)">
          {d.label}
        </text>
      ))}
    </svg>
  );
}
