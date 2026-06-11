/*
 * A clean, classic bare tree — single trunk, symmetric branching,
 * copper-tipped twigs, gentle root spread. When `draw` is set the tree
 * draws itself in like a pen stroke, roots first.
 */
const TREE_PATHS = [
  // base — flat root feet
  { d: 'M100,180 C92,184 78,186 64,186', w: 4.5, delay: 0 },
  { d: 'M100,180 C108,184 122,186 136,186', w: 4.5, delay: 0 },
  // trunk
  { d: 'M100,180 C100,158 99,138 100,112', w: 6, delay: 0.25 },
  // main fork — two arms and a centre leader
  { d: 'M100,112 C90,98 80,90 68,78', w: 5, delay: 0.6 },
  { d: 'M100,112 C110,98 120,90 132,78', w: 5, delay: 0.6 },
  { d: 'M100,112 C100,96 100,86 100,72', w: 4.5, delay: 0.7 },
  // secondary branches
  { d: 'M68,78 C58,68 50,58 46,44', w: 3.5, delay: 0.95 },
  { d: 'M68,78 C66,64 64,54 66,40', w: 3.5, delay: 1.0 },
  { d: 'M132,78 C142,68 150,58 154,44', w: 3.5, delay: 0.95 },
  { d: 'M132,78 C134,64 136,54 134,40', w: 3.5, delay: 1.0 },
  { d: 'M100,72 C94,60 92,50 92,38', w: 3, delay: 1.05 },
  { d: 'M100,72 C106,60 108,50 108,38', w: 3, delay: 1.05 },
  // mid-level side branches with reaching twigs
  { d: 'M82,94 C74,92 70,96 62,94 C56,93 54,98 46,98', w: 2, delay: 1.25 },
  { d: 'M62,94 C60,102 54,106 50,112', w: 1.7, delay: 1.4 },
  { d: 'M118,94 C126,92 130,96 138,94 C144,93 146,98 154,98', w: 2, delay: 1.25 },
  { d: 'M138,94 C140,102 146,106 150,112', w: 1.7, delay: 1.4 },
  // inner canopy twigs
  { d: 'M66,64 C58,62 56,56 48,56', w: 1.9, delay: 1.35 },
  { d: 'M134,64 C142,62 144,56 152,56', w: 1.9, delay: 1.35 },
  { d: 'M90,80 C86,72 88,66 84,60', w: 1.7, delay: 1.45 },
  { d: 'M110,80 C114,72 112,66 116,60', w: 1.7, delay: 1.45 },
  { d: 'M92,52 C86,48 84,42 78,40', w: 1.7, delay: 1.5 },
  { d: 'M108,52 C114,48 116,42 122,40', w: 1.7, delay: 1.5 },
  // thick copper tips crowning the main branches
  { d: 'M46,44 C43,36 42,28 44,18', w: 3.2, copper: true, delay: 1.6 },
  { d: 'M66,40 C67,32 68,24 66,14', w: 3.2, copper: true, delay: 1.65 },
  { d: 'M92,38 C90,30 90,22 92,12', w: 3.2, copper: true, delay: 1.7 },
  { d: 'M108,38 C110,30 110,22 108,12', w: 3.2, copper: true, delay: 1.7 },
  { d: 'M134,40 C133,32 132,24 134,14', w: 3.2, copper: true, delay: 1.65 },
  { d: 'M154,44 C157,36 158,28 156,18', w: 3.2, copper: true, delay: 1.6 },
  // fine copper sprigs off the tips
  { d: 'M44,18 C40,14 36,12 32,8', w: 1.5, copper: true, delay: 1.85 },
  { d: 'M66,14 C62,10 60,8 58,3', w: 1.5, copper: true, delay: 1.9 },
  { d: 'M156,18 C160,14 164,12 168,8', w: 1.5, copper: true, delay: 1.85 },
  { d: 'M134,14 C138,10 140,8 142,3', w: 1.5, copper: true, delay: 1.9 },
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
        <g style={draw ? { opacity: 0, animation: 'fadeUp 1.1s ease 2.6s forwards' } : undefined}>
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
