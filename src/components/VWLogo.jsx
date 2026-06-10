export default function VWLogo({ size = 120, showText = true, light = false }) {
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
      {/* W root system */}
      <path
        d="M70 195 L82 165 L93 185 L100 160 L107 185 L118 165 L130 195"
        stroke={green}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* trunk */}
      <path d="M100 160 L100 118" stroke={green} strokeWidth="7" strokeLinecap="round" />
      {/* V bifurcation */}
      <path d="M100 118 L72 70" stroke={green} strokeWidth="6" strokeLinecap="round" />
      <path d="M100 118 L128 70" stroke={green} strokeWidth="6" strokeLinecap="round" />
      {/* left branches */}
      <path d="M72 70 Q60 52 42 46" stroke={green} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M72 70 Q70 48 62 32" stroke={green} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M85 95 Q66 88 52 92" stroke={green} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M42 46 Q32 42 24 44" stroke={copper} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M62 32 Q58 22 50 16" stroke={copper} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M62 32 Q68 20 66 12" stroke={copper} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M52 92 Q40 94 34 100" stroke={copper} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* right branches */}
      <path d="M128 70 Q140 52 158 46" stroke={green} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M128 70 Q130 48 138 32" stroke={green} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M115 95 Q134 88 148 92" stroke={green} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M158 46 Q168 42 176 44" stroke={copper} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M138 32 Q142 22 150 16" stroke={copper} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M138 32 Q132 20 134 12" stroke={copper} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M148 92 Q160 94 166 100" stroke={copper} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* centre twigs */}
      <path d="M100 118 Q100 92 96 78" stroke={green} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M96 78 Q92 64 96 54" stroke={copper} strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {showText && (
        <>
          <text
            x="100"
            y="232"
            textAnchor="middle"
            fill={copper}
            style={{
              font: '700 26px Cormorant Garamond, serif',
              letterSpacing: '0.22em',
            }}
          >
            VAN WYK
          </text>
          <text
            x="100"
            y="254"
            textAnchor="middle"
            fill={copper}
            style={{
              font: '300 10.5px Raleway, sans-serif',
              letterSpacing: '0.34em',
            }}
          >
            FAMILY LAW ADVISORY
          </text>
        </>
      )}
    </svg>
  );
}
