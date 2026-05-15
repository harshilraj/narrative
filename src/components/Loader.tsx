"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type NodePoint = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  phase: number;
};

const BOOT_LINES = [
  "orchestration kernel",
  "cloud routes",
  "policy memory",
  "execution graph",
  "audit surface",
];

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    let frame = 0;
    let animationFrame = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const nodes: NodePoint[] = Array.from({ length: 34 }, (_, index) => {
      const ring = index % 3;
      const angle = (index / 34) * Math.PI * 2;
      const radiusX = 150 + ring * 105;
      const radiusY = 78 + ring * 56;
      return {
        x: width / 2 + Math.cos(angle) * radiusX,
        y: height / 2 + Math.sin(angle) * radiusY,
        tx: width / 2 + Math.cos(angle) * radiusX,
        ty: height / 2 + Math.sin(angle) * radiusY,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const render = () => {
      frame += 0.012;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#02010f";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = "rgba(139,127,255,0.08)";
      ctx.lineWidth = 1;
      for (let ring = 0; ring < 3; ring++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, 170 + ring * 115, 90 + ring * 58, Math.sin(frame * 0.3) * 0.08, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      nodes.forEach((node, index) => {
        node.x += (node.tx + Math.sin(frame * 1.5 + node.phase) * 8 - node.x) * 0.045;
        node.y += (node.ty + Math.cos(frame * 1.2 + node.phase) * 6 - node.y) * 0.045;

        if (index % 2 === 0) {
          const next = nodes[(index + 5) % nodes.length];
          const opacity = 0.035 + Math.sin(frame * 2 + index) * 0.018;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(139,127,255,${opacity})`;
          ctx.stroke();
        }

        const pulse = 0.5 + Math.sin(frame * 3 + node.phase) * 0.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.2 + pulse * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(169,159,255,${0.22 + pulse * 0.22})`;
        ctx.fill();
      });

      const runner = (frame * 0.18) % 1;
      ctx.beginPath();
      ctx.arc(cx - 330 + runner * 660, cy + Math.sin(runner * Math.PI * 2) * 98, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(244,241,255,0.8)";
      ctx.fill();

      animationFrame = requestAnimationFrame(render);
    };

    render();

    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        onComplete();
      },
    });

    tl.fromTo(panelRef.current, { opacity: 0, y: 18, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out", delay: 0.15 })
      .to(".loader-status-line", { opacity: 1, x: 0, duration: 0.35, stagger: 0.12, ease: "power2.out" }, "-=0.15")
      .to(".loader-progress-fill", { scaleX: 1, duration: 1.35, ease: "power2.inOut" }, "-=0.25")
      .to(panelRef.current, { opacity: 0, y: -10, filter: "blur(8px)", duration: 0.55, ease: "power2.inOut", delay: 0.25 })
      .to(containerRef.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.2");

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
      tl.kill();
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] overflow-hidden bg-[#02010f]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,1,15,0.38)_54%,rgba(2,1,15,0.92)_100%)]" />

      <div ref={panelRef} className="loader-console">
        <div className="loader-kicker">Narrative AI</div>
        <h1>Operational Layer Online</h1>
        <div className="loader-status">
          {BOOT_LINES.map((line) => (
            <div key={line} className="loader-status-line">
              <span />
              {line} initialized
            </div>
          ))}
        </div>
        <div className="loader-progress">
          <div className="loader-progress-fill" />
        </div>
      </div>
    </div>
  );
}
