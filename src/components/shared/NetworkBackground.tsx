import { useEffect, useRef } from 'react';

type Variant = 'circuit' | 'nodes' | 'fiber' | 'grid' | 'wave';

interface Props {
  variant?: Variant;
  opacity?: number;
  className?: string;
  color?: string;
}

/**
 * Animated network-themed background component.
 * Variants: circuit, nodes, fiber, grid, wave
 */
export default function NetworkBackground({ variant = 'circuit', opacity = 0.06, className = '', color = '#E30613' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const p = canvas.parentElement;
      if (!p) return;
      canvas.width = p.offsetWidth * dpr;
      canvas.height = p.offsetHeight * dpr;
      canvas.style.width = p.offsetWidth + 'px';
      canvas.style.height = p.offsetHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.width / dpr;
    const h = () => canvas.height / dpr;

    let frame = 0;

    const drawCircuit = () => {
      const W = w(), H = h();
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Draw circuit traces
      const spacing = 60;
      const cols = Math.ceil(W / spacing) + 1;
      const rows = Math.ceil(H / spacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const pulse = Math.sin(frame * 0.02 + i * 0.5 + j * 0.3) * 0.5 + 0.5;

          // Node dots
          ctx.beginPath();
          ctx.arc(x, y, 2 + pulse * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity * (0.3 + pulse * 0.7);
          ctx.fill();

          // Horizontal traces
          if (i < cols - 1 && (i + j) % 3 === 0) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + spacing, y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = opacity * (0.2 + pulse * 0.4);
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Vertical traces
          if (j < rows - 1 && (i + j) % 4 === 1) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + spacing);
            ctx.strokeStyle = color;
            ctx.globalAlpha = opacity * (0.2 + pulse * 0.3);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawNodes = () => {
      const W = w(), H = h();
      ctx.clearRect(0, 0, W, H);
      frame++;

      const nodeCount = 20;
      for (let i = 0; i < nodeCount; i++) {
        const x = ((i * 137) % W);
        const y = ((i * 251) % H);
        const pulse = Math.sin(frame * 0.015 + i * 1.2) * 0.5 + 0.5;
        const r = 20 + pulse * 15;

        // Outer ring
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity * (0.3 + pulse * 0.4);
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity * (0.5 + pulse * 0.5);
        ctx.fill();

        // Connection lines to nearest neighbors
        for (let j = i + 1; j < Math.min(i + 4, nodeCount); j++) {
          const x2 = ((j * 137) % W);
          const y2 = ((j * 251) % H);
          const dist = Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);
          if (dist < 300) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color;
            ctx.globalAlpha = opacity * 0.2;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawFiber = () => {
      const W = w(), H = h();
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Flowing fiber strands
      for (let i = 0; i < 8; i++) {
        const yOffset = H * (i / 8) + 30;
        ctx.beginPath();
        for (let x = 0; x < W; x += 3) {
          const wave = Math.sin(x * 0.008 + frame * 0.025 + i * 0.8) * 30;
          if (x === 0) ctx.moveTo(x, yOffset + wave);
          else ctx.lineTo(x, yOffset + wave);
        }
        const pulse = Math.sin(frame * 0.02 + i) * 0.5 + 0.5;
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity * (0.3 + pulse * 0.5);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Data packet dots traveling along fiber
        const packetX = (frame * 2 + i * 200) % W;
        const packetY = yOffset + Math.sin(packetX * 0.008 + frame * 0.025 + i * 0.8) * 30;
        ctx.beginPath();
        ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity * 3;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const drawGrid = () => {
      const W = w(), H = h();
      ctx.clearRect(0, 0, W, H);
      frame++;

      const gridSize = 40;
      for (let x = 0; x < W; x += gridSize) {
        const pulse = Math.sin(frame * 0.01 + x * 0.005) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity * (0.15 + pulse * 0.2);
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        const pulse = Math.sin(frame * 0.01 + y * 0.005) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity * (0.15 + pulse * 0.2);
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Highlight intersections
      for (let x = 0; x < W; x += gridSize * 3) {
        for (let y = 0; y < H; y += gridSize * 3) {
          const pulse = Math.sin(frame * 0.02 + x * 0.01 + y * 0.01) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 2 + pulse * 2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity * (0.4 + pulse * 0.6);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawWave = () => {
      const W = w(), H = h();
      ctx.clearRect(0, 0, W, H);
      frame++;

      for (let i = 0; i < 5; i++) {
        const baseY = H * 0.3 + i * (H * 0.1);
        ctx.beginPath();
        for (let x = 0; x < W; x += 2) {
          const y = baseY + Math.sin(x * 0.005 + frame * 0.02 + i * 1.5) * (20 + i * 8)
                   + Math.sin(x * 0.01 + frame * 0.03 + i) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity * (0.3 + (5 - i) * 0.12);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const drawFns: Record<Variant, () => void> = {
      circuit: drawCircuit,
      nodes: drawNodes,
      fiber: drawFiber,
      grid: drawGrid,
      wave: drawWave,
    };

    const draw = drawFns[variant] || drawCircuit;

    const loop = () => {
      draw();
      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [variant, opacity, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
