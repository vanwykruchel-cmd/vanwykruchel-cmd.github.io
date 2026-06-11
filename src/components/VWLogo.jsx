/*
 * The Van Wyk tree: two trunk strands cross to form the V (and the diamond
 * interlock at the heart of the tree), the roots trace the W, and the canopy
 * spreads wide with copper-tipped twigs. When `draw` is set, the logo draws
 * itself in like a pen stroke, from the roots upward.
 */
const TREE_PATHS = [
  // roots — the W
  { d: 'M62,194 L80,166 L93,182 L100,162 L107,182 L120,166 L138,194', w: 5, delay: 0 },
  { d: 'M80,166 C70,172 60,172 50,180', w: 2.5, copper: true, delay: 0.35 },
  { d: 'M120,166 C130,172 140,172 150,180', w: 2.5, copper: true, delay: 0.35 },
  // trunk — two strands crossing twice, forming the diamond and the V
  { d: 'M93,166 C97,146 114,140 112,116 C110,98 97,92 96,74', w: 5, delay: 0.5 },
  { d: 'M107,166 C103,146 86,140 88,116 C90,98 103,92 104,74', w: 5, delay: 0.5 },
  // the V opens
  { d: 'M96,74 C88,60 76,52 64,46', w: 4.5, delay: 1.0 },
  { d: 'M104,74 C112,60 124,52 136,46', w: 4.5, delay: 1.0 },
  { d: 'M97,72 C95,58 97,48 92,36', w: 3.5, delay: 1.15 },
  { d: 'M103,72 C105,58 103,48 108,36', w: 3.5, delay: 1.15 },
  // canopy — left
  { d: 'M64,46 C50,42 42,34 30,32', w: 3.5, delay: 1.3 },
  { d: 'M64,46 C58,34 52,28 50,18', w: 3.5, delay: 1.4 },
  { d: 'M64,46 C56,48 46,52 38,58', w: 2.6, delay: 1.5 },
  // canopy — right
  { d: 'M136,46 C150,42 158,34 170,32', w: 3.5, delay: 1.3 },
  { d: 'M136,46 C142,34 148,28 150,18', w: 3.5, delay: 1.4 },
  { d: 'M136,46 C144,48 154,52 162,58', w: 2.6, delay: 1.5 },
  // copper twigs — the fine ends
  { d: 'M30,32 C22,30 16,24 12,18', w: 2.2, copper: true, delay: 1.65 },
  { d: 'M50,18 C46,10 42,6 36,2', w: 2.2, copper: true, delay: 1.72 },
  { d: 'M38,58 C30,62 26,68 24,74', w: 2, copper: true, delay: 1.8 },
  { d: 'M170,32 C178,30 184,24 188,18', w: 2.2, copper: true, delay: 1.65 },
  { d: 'M150,18 C154,10 158,6 164,2', w: 2.2, copper: true, delay: 1.72 },
  { d: 'M162,58 C170,62 174,68 176,74', w: 2, copper: true, delay: 1.8 },
  { d: 'M92,36 C88,26 84,20 84,12', w: 2.2, copper: true, delay: 1.88 },
  { d: 'M108,36 C112,26 116,20 116,12', w: 2.2, copper: true, delay: 1.88 },
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
        <g style={draw ? { opacity: 0, animation: 'fadeUp 1.1s ease 2.25s forwards' } : undefined}>
          <text
            x="100"
            y="232"
            textAnchor="middle"
            fill={copper}
            style={{ font: '700 26px Cormorant Garamond, serif', letterSpacing: '0.22em' }}
          >
            VAN WYK
          </text>
          <text
            x="100"
            y="254"
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
