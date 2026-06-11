import { useEffect, useRef } from 'react';

/*
 * InkDrawing — renders SVG paths that draw themselves like a pen stroke.
 * mode 'scroll': drawing progress is tied to the element's position in the
 * viewport, so the pen literally moves as you scroll.
 * mode 'auto': draws once over `duration` ms when it enters the viewport.
 * pen: shows a copper fountain-pen nib travelling along the line being drawn.
 */
export default function InkDrawing({
  paths,
  viewBox,
  mode = 'scroll',
  duration = 3200,
  pen = false,
  style,
  strokeBase = 'var(--forest)',
}) {
  const svgRef = useRef(null);
  const penRef = useRef(null);
  const pathRefs = useRef([]);
  const anim = useRef({ started: false, t0: 0 });

  useEffect(() => {
    const els = pathRefs.current.filter(Boolean);
    if (!els.length) return;
    const lens = els.map((el) => el.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);

    els.forEach((el, i) => {
      el.style.strokeDasharray = String(lens[i]);
      el.style.strokeDashoffset = String(lens[i]);
    });

    function setProgress(p) {
      let acc = 0;
      let penPt = null;
      let penAng = 0;
      els.forEach((el, i) => {
        const start = acc / total;
        const end = (acc + lens[i]) / total;
        acc += lens[i];
        let lp = (p - start) / (end - start);
        lp = Math.max(0, Math.min(1, lp));
        el.style.strokeDashoffset = String(lens[i] * (1 - lp));
        if (pen && lp > 0 && lp < 1 && !penPt) {
          const d = lens[i] * lp;
          const pt = el.getPointAtLength(d);
          const pt2 = el.getPointAtLength(Math.min(lens[i], d + 1.5));
          penPt = pt;
          penAng = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
        }
      });
      if (pen && penRef.current) {
        if (penPt && p < 1) {
          penRef.current.style.opacity = '1';
          penRef.current.setAttribute('transform', `translate(${penPt.x},${penPt.y}) rotate(${penAng})`);
        } else {
          penRef.current.style.opacity = '0';
        }
      }
    }

    let raf;
    function frame(now) {
      const svg = svgRef.current;
      if (svg && document.visibilityState === 'visible') {
        const rect = svg.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.bottom > -120 && rect.top < vh + 120) {
          let p = 0;
          if (mode === 'scroll') {
            p = (vh * 0.9 - rect.top) / (vh * 0.55);
            p = Math.max(0, Math.min(1, p));
          } else {
            if (!anim.current.started && rect.top < vh * 0.78) {
              anim.current.started = true;
              anim.current.t0 = now;
            }
            if (anim.current.started) {
              const t = Math.min(1, (now - anim.current.t0) / duration);
              p = 1 - Math.pow(1 - t, 3);
            }
          }
          setProgress(p);
        }
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [mode, duration, pen, paths]);

  return (
    <svg ref={svgRef} viewBox={viewBox} fill="none" style={style} aria-hidden="true">
      {paths.map((p, i) => (
        <path
          key={i}
          ref={(el) => (pathRefs.current[i] = el)}
          d={p.d}
          stroke={p.copper ? 'var(--copper)' : strokeBase}
          strokeWidth={p.w || 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
      {pen && (
        <g ref={penRef} style={{ opacity: 0, transition: 'opacity 0.3s' }}>
          <path d="M0,0 L-16,-5 L-11.5,0 L-16,5 Z" fill="var(--copper)" />
          <path d="M-16,0 L-32,-3" stroke="var(--copper)" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
