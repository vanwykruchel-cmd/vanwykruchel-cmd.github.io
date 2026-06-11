/*
 * A clean, classic bare tree — single trunk, symmetric branching,
 * copper-tipped twigs, gentle root spread. When `draw` is set the tree
 * draws itself in like a pen stroke, roots first.
 */
const TREE_PATHS = [
  // roots
  { d: 'M100,170 C90,178 78,182 64,184', w: 4, delay: 0 },
  { d: 'M100,170 C110,178 122,182 136,184', w: 4, delay: 0 },
  { d: 'M100,170 L100,182', w: 3.5, delay: 0.1 },
  // trunk
  { d: 'M100,170 C100,150 98,135 100,110', w: 6, delay: 0.3 },
  // low twigs
  { d: 'M100,140 C90,136 84,130 80,124', w: 2.5, delay: 0.55 },
  { d: 'M100,140 C110,136 116,130 120,124', w: 2.5, delay: 0.55 },
  // main fork
  { d: 'M100,110 C92,96 82,88 70,78', w: 5, delay: 0.7 },
  { d: 'M100,110 C108,96 118,88 130,78', w: 5, delay: 0.7 },
  { d: 'M100,110 C100,94 100,84 100,70', w: 4, delay: 0.8 },
  // secondary branches
  { d: 'M70,78 C60,72 52,62 48,52', w: 3.5, delay: 1.1 },
  { d: 'M70,78 C64,66 62,58 62,46', w: 3.5, delay: 1.15 },
  { d: 'M130,78 C140,72 148,62 152,52', w: 3.5, delay: 1.1 },
  { d: 'M130,78 C136,66 138,58 138,46', w: 3.5, delay: 1.15 },
  { d: 'M100,70 C94,60 92,52 90,42', w: 3, delay: 1.2 },
  { d: 'M100,70 C106,60 108,52 110,42', w: 3, delay: 1.2 },
  // copper tips
  { d: 'M48,52 C44,44 42,38 42,30', w: 2.2, copper: true, delay: 1.5 },
  { d: 'M62,46 C60,38 60,32 62,24', w: 2.2, copper: true, delay: 1.55 },
  { d: 'M90,42 C88,34 88,28 90,20', w: 2.2, copper: true, delay: 1.6 },
  { d: 'M110,42 C112,34 112,28 110,20', w: 2.2, copper: true, delay: 1.6 },
  { d: 'M138,46 C140,38 140,32 138,24', w: 2.2, copper: true, delay: 1.55 },
  { d: 'M152,52 C156,44 158,38 158,30', w: 2.2, copper: true, delay: 1.5 },
  { d: 'M80,124 C74,120 70,114 68,108', w: 1.8, copper: true, delay: 1.65 },
  { d: 'M120,124 C126,120 130,114 132,108', w: 1.8, copper: true, delay: 1.65 },
];

export default function VWLogo({ size = 120, showText = true, light = false, draw = false }) {
  const green = light ? '#F7F3EC' : '#2D4A3E';
  const copper = '#B5714A';
  return (
    <svg
      width={size}
      height={showText ? size * 1.35 : size}
      viewBox={showText ? '0 0 200 270' : '0 0 200 200'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Van Wyk Family Law Advisory"
    >
      {TREE_PATHS.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={p.copper ? copper : green}
          strokeWidth={p.w}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          pathLength={draw ? 1 : undefined}
          style={
            draw
              ? {
                  strokeDasharray: 1,
                  strokeDashoffset: 1,
                  animation: `inkdraw 1.1s cubic-bezier(0.4, 0, 0.2, 1) ${p.delay}s forwards`,
                }
              : undefined
          }
        />
      ))}

      {showText && (
        <g style={draw ? { opacity: 0, animation: 'fadeUp 1.1s ease 2s forwards' } : undefined}>
          <text
            x="100"
            y="226"
            textAnchor="middle"
            fill={copper}
            style={{ font: '700 26px Cormorant Garamond, serif', letterSpacing: '0.22em' }}
          >
            VAN WYK
          </text>
          <text
            x="100"
            y="248"
            textAnchor="middle"
            fill={copper}
            style={{ font: '300 10.5px Raleway, sans-serif', letterSpacing: '0.34em' }}
          >
            FAMILY LAW ADVISORY
          </text>
        </g>
      )}
    </svg>
  );
}
