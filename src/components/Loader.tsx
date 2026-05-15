"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type Particle = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  speed: number;
};

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const count = 120;
    const particles: Particle[] = [];
    
    // Initialize scattered particles
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        originX: Math.random() * w,
        originY: Math.random() * h,
        targetX: w / 2 + (Math.random() - 0.5) * 600,
        targetY: h / 2 + (Math.random() - 0.5) * 400,
        size: Math.random() * 1.5 + 0.5,
        opacity: 0,
        speed: 0.01 + Math.random() * 0.02,
      });
    }

    let animationFrame: number;
    let progress = 0;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      progress += 0.008;

      particles.forEach((p, i) => {
        // Phase 1: Fade in and drift
        p.opacity = Math.min(1, progress * 3);
        
        // Phase 2: Form routing paths (converge towards targets)
        const lerpFactor = Math.max(0, (progress - 0.2) * 2);
        const curX = p.originX + (p.targetX - p.originX) * Math.min(1, lerpFactor);
        const curY = p.originY + (p.targetY - p.originY) * Math.min(1, lerpFactor);
        
        // Add flowing motion
        p.x = curX + Math.sin(progress * 2 + i) * 20 * (1 - Math.min(1, lerpFactor));
        p.y = curY + Math.cos(progress * 2 + i) * 20 * (1 - Math.min(1, lerpFactor));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 108, 240, ${p.opacity * 0.4})`;
        ctx.fill();

        // Phase 3: Connect structures
        if (progress > 0.5) {
          particles.forEach((p2, j) => {
            if (i === j || j > i + 3) return; // Only connect to a few neighbors
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 80) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(91, 142, 240, ${Math.max(0, (1 - dist / 80) * (progress - 0.5) * 0.4)})`;
              ctx.stroke();
            }
          });
        }
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    // Cinematic Sequence
    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        onComplete();
      }
    });

    tl.to(textRef.current, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.5
    })
    .to(textRef.current, {
      opacity: 0,
      filter: "blur(8px)",
      duration: 1.0,
      delay: 0.8,
      ease: "power2.inOut"
    })
    .to(containerRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut"
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      tl.kill();
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030408] overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      
      {/* Cinematic Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-10"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

      <div 
        ref={textRef}
        className="relative z-20 flex flex-col items-center justify-center opacity-0 translate-y-12 blur-md"
      >
        <div className="flex flex-col items-center gap-1">
          <div className="t-label text-[10px] tracking-[0.6em] text-[#8B7FFF] mb-4 opacity-80">
            Initializing Intelligence
          </div>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#8B7FFF]/40 to-transparent mb-10"></div>
          
          <h1 className="text-3xl font-serif text-white tracking-[0.2em] font-light">
            NARRATIVE AI
          </h1>
          
          <div className="mt-10 flex items-center gap-4">
            <div className="w-1 h-1 rounded-full bg-[#8B7FFF] animate-pulse"></div>
            <div className="w-1 h-1 rounded-full bg-[#8B7FFF] animate-pulse delay-75"></div>
            <div className="w-1 h-1 rounded-full bg-[#8B7FFF] animate-pulse delay-150"></div>
          </div>
        </div>
      </div>

      {/* Atmospheric depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,108,240,0.05)_0%,_transparent_70%)]" />
    </div>
  );
}
