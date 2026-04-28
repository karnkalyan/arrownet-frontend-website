import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  isNode: boolean; // highlight some as "network nodes"
}

interface Props {
  count?: number;
  className?: string;
}

export default function ParticleNetwork({ count = 120, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const colors = ['#f97316', '#ef4444', '#eab308', '#fb923c', '#fbbf24', '#fdba74'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        dpr = window.devicePixelRatio || 1;
        canvas.width = parent.offsetWidth * dpr;
        canvas.height = parent.offsetHeight * dpr;
        canvas.style.width = parent.offsetWidth + 'px';
        canvas.style.height = parent.offsetHeight + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const logicalW = () => canvas.width / dpr;
    const logicalH = () => canvas.height / dpr;

    // Init particles
    particlesRef.current = Array.from({ length: count }, (_, i) => {
      const isNode = i < Math.floor(count * 0.12); // 12% are "nodes"
      const radius = isNode ? (Math.random() * 2.5 + 2) : (Math.random() * 2 + 0.8);
      return {
        x: Math.random() * logicalW(),
        y: Math.random() * logicalH(),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: isNode ? (Math.random() * 0.4 + 0.5) : (Math.random() * 0.4 + 0.2),
        pulseSpeed: 0.008 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        isNode,
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let frame = 0;
    const CONNECTION_DIST = 180;
    const MOUSE_RADIUS = 250;

    const animate = () => {
      if (!ctx || !canvas) return;
      const w = logicalW();
      const h = logicalH();
      ctx.clearRect(0, 0, w, h);
      frame++;

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // ── Draw connections (below particles) ──
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          const maxDistSq = CONNECTION_DIST * CONNECTION_DIST;

          if (distSq < maxDistSq) {
            const distance = Math.sqrt(distSq);
            const alpha = (1 - distance / CONNECTION_DIST);

            // Pulse the connection brightness
            const pulse = Math.sin(frame * 0.015 + p1.pulsePhase + p2.pulsePhase) * 0.5 + 0.5;
            const lineAlpha = alpha * (0.2 + pulse * 0.25);

            // Gradient line between two particles
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, `rgba(249, 115, 22, ${lineAlpha})`);
            grad.addColorStop(0.5, `rgba(239, 68, 68, ${lineAlpha * 0.8})`);
            grad.addColorStop(1, `rgba(234, 179, 8, ${lineAlpha})`);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = (p1.isNode || p2.isNode) ? 1.2 : 0.8;
            ctx.stroke();
          }
        }

        // Mouse proximity connections
        const mDx = mouse.x - p1.x;
        const mDy = mouse.y - p1.y;
        const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
        if (mDist < MOUSE_RADIUS) {
          const alpha = (1 - mDist / MOUSE_RADIUS) * 0.4;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(249, 115, 22, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // ── Draw particles ──
      particles.forEach(p => {
        // Mouse attraction / repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / 3000;
          p.vx += dx * force * 0.08;
          p.vy += dy * force * 0.08;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Friction
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Wrap
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const pulse = Math.sin(frame * p.pulseSpeed + p.pulsePhase) * 0.35 + 0.65;
        const r = p.radius * pulse;
        const opacity = p.opacity * pulse;

        // ─ Outer glow ─
        if (p.isNode) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 8, 0, Math.PI * 2);
          const outerGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 8);
          outerGlow.addColorStop(0, p.color + '30');
          outerGlow.addColorStop(0.5, p.color + '10');
          outerGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = outerGlow;
          ctx.globalAlpha = opacity * 0.7;
          ctx.fill();
        }

        // ─ Inner glow ─
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        gradient.addColorStop(0, p.color + '40');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity * 0.6;
        ctx.fill();

        // ─ Particle core ─
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();

        // Add a bright center to nodes
        if (p.isNode) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = opacity * 0.7;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      });

      // ── Mouse cursor glow ──
      if (mouse.x > 0 && mouse.y > 0 && mouse.x < w && mouse.y < h) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
        const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 60);
        mouseGlow.addColorStop(0, 'rgba(249, 115, 22, 0.08)');
        mouseGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = mouseGlow;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'auto' }}
    />
  );
}
