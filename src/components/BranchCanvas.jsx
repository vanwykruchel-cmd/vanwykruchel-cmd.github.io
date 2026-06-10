import { useEffect, useRef } from 'react';

class Branch {
  constructor(x, y, angle, length, depth) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = length;
    this.depth = depth;
    this.progress = 0;
    this.curve = (Math.random() - 0.5) * 0.9;
    this.children = [];
    this.spawned = false;
    this.speed = 0.008 + Math.random() * 0.007;
  }

  tip(p = this.progress) {
    const ex = this.x + Math.cos(this.angle) * this.length;
    const ey = this.y + Math.sin(this.angle) * this.length;
    const cx = this.x + Math.cos(this.angle + this.curve) * this.length * 0.5;
    const cy = this.y + Math.sin(this.angle + this.curve) * this.length * 0.5;
    const t = p;
    const mt = 1 - t;
    return {
      x: mt * mt * this.x + 2 * mt * t * cx + t * t * ex,
      y: mt * mt * this.y + 2 * mt * t * cy + t * t * ey,
      cx,
      cy,
      ex,
      ey,
    };
  }

  update() {
    if (this.progress < 1) this.progress = Math.min(1, this.progress + this.speed);
    if (this.progress > 0.88 && !this.spawned && this.depth < 6) {
      this.spawned = true;
      const t = this.tip(1);
      const n = 2 + (Math.random() > 0.6 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        const spread = (Math.random() - 0.5) * 1.15;
        this.children.push(
          new Branch(t.x, t.y, this.angle + spread - 0.12, this.length * (0.62 + Math.random() * 0.16), this.depth + 1)
        );
      }
    }
    this.children.forEach((c) => c.update());
  }

  draw(ctx, frame) {
    const t = this.tip();
    const grad = ctx.createLinearGradient(this.x, this.y, t.x, t.y);
    grad.addColorStop(0, 'rgba(58, 94, 78, 0.85)');
    grad.addColorStop(1, 'rgba(181, 113, 74, 0.9)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.max(0.6, 6 - this.depth * 1.1);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    // draw partial quadratic by sampling
    const steps = 14;
    for (let i = 1; i <= steps; i++) {
      const p = (i / steps) * this.progress;
      const mt = 1 - p;
      const px = mt * mt * this.x + 2 * mt * p * t.cx + p * p * t.ex;
      const py = mt * mt * this.y + 2 * mt * p * t.cy + p * p * t.ey;
      ctx.lineTo(px, py);
    }
    ctx.stroke();

    if (this.depth >= 4 && this.progress >= 1) {
      const glow = 0.35 + 0.3 * Math.sin(frame * 0.04 + this.x * 0.05);
      const g = ctx.createRadialGradient(t.ex, t.ey, 0, t.ex, t.ey, 7);
      g.addColorStop(0, `rgba(201, 138, 101, ${glow})`);
      g.addColorStop(1, 'rgba(201, 138, 101, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(t.ex, t.ey, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    this.children.forEach((c) => c.draw(ctx, frame));
  }
}

export default function BranchCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let frame = 0;
    let roots = [];

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(rect.width, rect.height);
    }

    function seed(w, h) {
      roots = [];
      const baseX = w / 2;
      const baseY = h * 0.92;
      roots.push(new Branch(baseX, baseY, -Math.PI / 2 - 0.35, h * 0.2, 0));
      roots.push(new Branch(baseX, baseY, -Math.PI / 2 + 0.35, h * 0.2, 0));
      roots.push(new Branch(baseX, baseY, -Math.PI / 2, h * 0.16, 1));
    }

    function loop() {
      if (document.visibilityState === 'visible') {
        frame++;
        const rect = canvas.parentElement.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        roots.forEach((r) => {
          r.update();
          r.draw(ctx, frame);
        });
      }
      raf = requestAnimationFrame(loop);
    }

    resize();
    loop();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}
