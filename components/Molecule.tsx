/**
 * Line drawing of a small polycyclic molecule, in the style of a chemistry
 * textbook skeletal formula. The hexagons echo the ones in the logo.
 * Purely decorative: colour comes from `currentColor`, opacity from the caller.
 */

const R = 36;
const DX = R * Math.cos(Math.PI / 6);
const DY = R / 2;

type Point = [number, number];

function ring([cx, cy]: Point): Point[] {
  return [-90, -30, 30, 90, 150, 210].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + R * Math.cos(rad), cy + R * Math.sin(rad)];
  });
}

function outline(points: Point[]) {
  return `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`;
}

/** Shorter parallel segment inside the ring: the second line of a double bond. */
function innerBond(center: Point, a: Point, b: Point) {
  const inset = (p: Point): Point => [center[0] + (p[0] - center[0]) * 0.74, center[1] + (p[1] - center[1]) * 0.74];
  const [p, q] = [inset(a), inset(b)];
  const trim = (from: Point, to: Point): Point => [from[0] + (to[0] - from[0]) * 0.12, from[1] + (to[1] - from[1]) * 0.12];
  const [s, e] = [trim(p, q), trim(q, p)];
  return `M${s[0].toFixed(1)} ${s[1].toFixed(1)}L${e[0].toFixed(1)} ${e[1].toFixed(1)}`;
}

/** Bond leaving a ring vertex radially, returning its end point for the atom label. */
function bond(center: Point, vertex: Point, length = R * 0.9): [string, Point] {
  const ux = (vertex[0] - center[0]) / R;
  const uy = (vertex[1] - center[1]) / R;
  const end: Point = [vertex[0] + ux * length, vertex[1] + uy * length];
  return [`M${vertex[0].toFixed(1)} ${vertex[1].toFixed(1)}L${end[0].toFixed(1)} ${end[1].toFixed(1)}`, end];
}

const A: Point = [150, 170];
const B: Point = [A[0] + 2 * DX, A[1]];
const C: Point = [B[0] + DX, B[1] + 3 * DY];
const ringA = ring(A);
const ringB = ring(B);
const ringC = ring(C);

// A fourth ring hangs off ring B's upper-right vertex by a single bond.
const linkStart = ringB[1];
const [linkPath, linkEnd] = bond(B, linkStart, R);
const D: Point = [linkEnd[0] + DX, linkEnd[1] - DY];
const ringD = ring(D);

const [ohPath, ohEnd] = bond(A, ringA[5]);
const [nPath, nEnd] = bond(C, ringC[3]);
const [oPath, oEnd] = bond(D, ringD[0]);
const [ch3Path] = bond(A, ringA[3]);
const [clPath, clEnd] = bond(D, ringD[2]);

const PATHS = [
  outline(ringA),
  outline(ringB),
  outline(ringC),
  outline(ringD),
  innerBond(A, ringA[0], ringA[1]),
  innerBond(A, ringA[2], ringA[3]),
  innerBond(A, ringA[4], ringA[5]),
  innerBond(C, ringC[1], ringC[2]),
  innerBond(C, ringC[3], ringC[4]),
  innerBond(D, ringD[0], ringD[1]),
  innerBond(D, ringD[2], ringD[3]),
  innerBond(D, ringD[4], ringD[5]),
  linkPath,
  ohPath,
  nPath,
  oPath,
  ch3Path,
  clPath,
];

const LABELS: { at: Point; text: string; dx?: number; dy?: number }[] = [
  { at: ohEnd, text: 'HO', dx: -12, dy: -4 },
  { at: nEnd, text: 'NH₂', dy: 14 },
  { at: oEnd, text: 'O', dy: -6 },
  { at: clEnd, text: 'Cl', dx: 12, dy: 6 },
];

export function Molecule({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="50 22 350 300" fill="none" aria-hidden="true" focusable="false" className={className}>
      <g stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        {PATHS.map((d, index) => <path key={index} d={d} />)}
      </g>
      <g fill="currentColor" fontSize={15} fontFamily="var(--font-onest), sans-serif" fontWeight={500} textAnchor="middle">
        {LABELS.map(({ at, text, dx = 0, dy = 0 }) => (
          <text key={text} x={at[0] + dx} y={at[1] + dy}>{text}</text>
        ))}
      </g>
    </svg>
  );
}
