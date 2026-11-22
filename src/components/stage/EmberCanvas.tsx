import React, { useEffect, useRef } from 'react';

interface EmberCanvasProps {
  active: boolean;
  expanded: boolean;
  instantMode: boolean;
}

export const EmberCanvas: React.FC<EmberCanvasProps> = ({ active, expanded, instantMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ active, expanded, instantMode });
  stateRef.current = { active, expanded, instantMode };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motes = Array.from({ length: 30 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 22 + Math.random() * 145,
      speed: 0.002 + Math.random() * 0.004,
      size: 0.8 + Math.random() * 1.8,
      alpha: 0.16 + Math.random() * 0.55,
    }));

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let rafId = 0;
    const draw = () => {
      const { active: isAct, expanded: isExp, instantMode: isInst } = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (isAct) {
        const cx = w / 2;
        const cy = h / 2;
        const spread = isExp ? 1.8 : 1;
        for (const m of motes) {
          m.angle += m.speed;
          m.radius += Math.sin(m.angle * 2) * 0.15;
          const x = cx + Math.cos(m.angle) * m.radius * spread;
          const y = cy + Math.sin(m.angle) * m.radius * 0.72 * spread;
          ctx.beginPath();
          ctx.arc(x, y, m.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${m.alpha * 0.68})`;
          ctx.fill();
        }
      }
      if (!isInst) {
        rafId = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [active, expanded, instantMode]);

  return <canvas ref={canvasRef} className="ember-canvas" />;
};
