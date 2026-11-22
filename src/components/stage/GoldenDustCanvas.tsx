import React, { useEffect, useRef } from 'react';

interface GoldenDustCanvasProps {
  visible: boolean;
  instantMode: boolean;
}

export const GoldenDustCanvas: React.FC<GoldenDustCanvasProps> = ({ visible, instantMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ visible, instantMode });
  stateRef.current = { visible, instantMode };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dust = Array.from({ length: 16 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: 0.00012 + Math.random() * 0.00018,
      vy: -(0.00008 + Math.random() * 0.0002),
      r: 1.0 + Math.random() * 1.6,
      a: 0.08 + Math.random() * 0.14,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let rafId = 0;
    const draw = () => {
      const { visible: isVis, instantMode: isInst } = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (isVis && !isInst) {
        for (const d of dust) {
          d.x = (d.x + d.vx) % 1;
          d.y = (d.y + d.vy + 1) % 1;
          ctx.beginPath();
          ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 243, 199, ${d.a})`;
          ctx.fill();
        }
        rafId = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [visible, instantMode]);

  return (
    <canvas
      ref={canvasRef}
      className={`golden-dust-canvas ${visible && !instantMode ? 'visible' : ''}`}
    />
  );
};
