import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FiberCable() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    const length = pathRef.current.getTotalLength();
    
    gsap.set(pathRef.current, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: svgRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    });
  }, []);

  return (
    <div className="relative w-full h-[300px] overflow-hidden pointer-events-none">
      <svg 
        ref={svgRef}
        viewBox="0 0 1000 300" 
        className="w-full h-full opacity-30"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M 0 150 Q 250 50 500 150 T 1000 150"
          fill="none"
          stroke="#E30613"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Glow effect */}
        <path
          d="M 0 150 Q 250 50 500 150 T 1000 150"
          fill="none"
          stroke="#E30613"
          strokeWidth="12"
          strokeLinecap="round"
          className="blur-xl opacity-20"
        />
      </svg>
    </div>
  );
}
