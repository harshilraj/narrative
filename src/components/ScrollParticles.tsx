"use client";
import { useEffect, useRef } from "react";

interface Palette {
  particleColor: [number, number, number];
  particleOpacity: number;
}

interface Props {
  palette: Palette;
  progress: number;
  reducedMotion: boolean;
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  opacitySpeed: number;
  phase: number;
  // Stream behavior (Act 3)
  streamAngle: number;
  streamSpeed: number;
}



export default function ScrollParticles({ palette, progress, reducedMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const paletteRef = useRef(palette);
  const progressRef = useRef(progress);

  paletteRef.current = palette;
  progressRef.current = progress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = reducedMotion ? 15 : isMobile ? 25 : 55;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    particlesRef.current = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      particlesRef.current.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.15 + 0.05,
        drift: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.3 + 0.1,
        opacitySpeed: (Math.random() - 0.5) * 0.0015,
        phase: Math.random() * Math.PI * 2,
        streamAngle: Math.random() * Math.PI * 0.5 - Math.PI * 0.25, // ~horizontal
        streamSpeed: Math.random() * 0.3 + 0.1,
      });
    }

    const draw = () => {
      const p = progressRef.current;
      const pal = paletteRef.current;
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;

      ctx.clearRect(0, 0, cw, ch);

      // Determine behavior based on act
      const isAct1 = p < 0.25;
      const isAct2 = p >= 0.25 && p < 0.5;
      const isAct3 = p >= 0.5 && p < 0.75;
      // const isAct4 = p >= 0.75; // Implied

      particlesRef.current.forEach((particle) => {
        if (isAct1) {
          // Erratic scattered motion
          particle.y -= particle.speed * 0.3;
          particle.x += particle.drift + Math.sin(particle.phase + p * 5) * 0.4;
          particle.phase += 0.005;
        } else if (isAct2) {
          // Organized drift upward, less horizontal jitter
          particle.y -= particle.speed * 0.25;
          particle.x += particle.drift * 0.2 + Math.sin(particle.phase) * 0.1;
          particle.phase += 0.002;
        } else if (isAct3) {
          // Stream flow — diagonal upward-right (like data flowing)
          particle.x += Math.cos(particle.streamAngle) * particle.streamSpeed * 0.4;
          particle.y -= Math.abs(Math.sin(particle.streamAngle)) * particle.streamSpeed * 0.25 + particle.speed * 0.15;
        } else {
          // Act 4: Gentle slow float
          particle.y -= particle.speed * 0.15;
          particle.x += Math.sin(particle.phase + p * 2) * 0.08;
          particle.phase += 0.0015;
        }

        // Opacity breathing
        particle.opacity += particle.opacitySpeed;
        if (particle.opacity > pal.particleOpacity + 0.1) particle.opacitySpeed = -Math.abs(particle.opacitySpeed);
        if (particle.opacity < 0.03) particle.opacitySpeed = Math.abs(particle.opacitySpeed);
        particle.opacity = Math.max(0.02, Math.min(particle.opacity, 0.65));

        // Wrap around
        if (particle.y < -10) {
          particle.y = ch + 10;
          particle.x = Math.random() * cw;
        }
        if (particle.x > cw + 10) {
          particle.x = -10;
          particle.y = Math.random() * ch;
        }
        if (particle.x < -10) {
          particle.x = cw + 10;
          particle.y = Math.random() * ch;
        }

        // Draw particle
        const r = pal.particleColor[0];
        const g = pal.particleColor[1];
        const b = pal.particleColor[2];

        // Glow
        if (particle.size > 1.2 && !reducedMotion) {
          const glowRadius = particle.size * 4;
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, glowRadius
          );
          gradient.addColorStop(0, `rgba(${r},${g},${b},${particle.opacity * 0.15})`);
          gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Core particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${particle.opacity})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    if (!reducedMotion) {
      animRef.current = requestAnimationFrame(draw);
    } else {
      // Static render for reduced motion
      draw();
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 11,
        pointerEvents: "none",
      }}
    />
  );
}
