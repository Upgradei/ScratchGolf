import { toTrendPoints, type TrendPoint } from "@/lib/trends";

const WIDTH = 300;
const HEIGHT = 80;
const PADDING = 8;

export function TrendChart({ scores }: { scores: TrendPoint[] }) {
  const points = toTrendPoints(scores);

  if (points.length === 0) {
    return <p className="text-sm text-sand-500">No scores yet.</p>;
  }

  if (points.length === 1) {
    return (
      <p className="text-sm text-sand-500">
        One score so far: <span className="font-medium">{points[0].value}</span>
      </p>
    );
  }

  const toSvgX = (x: number) => PADDING + x * (WIDTH - 2 * PADDING);
  const toSvgY = (y: number) => HEIGHT - PADDING - y * (HEIGHT - 2 * PADDING);

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toSvgX(p.x)} ${toSvgY(p.y)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full max-w-sm"
      role="img"
      aria-label="Score trend over time"
    >
      <path d={path} fill="none" stroke="#2d6339" strokeWidth={2} />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={toSvgX(p.x)}
          cy={toSvgY(p.y)}
          r={3}
          fill="#2d6339"
        />
      ))}
    </svg>
  );
}
