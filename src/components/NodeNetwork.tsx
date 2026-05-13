"use client";
import { useEffect, useRef } from "react";

interface Props {
  progress: number;
  reducedMotion: boolean;
}

/* ── Node definitions ── */
interface NodeDef {
  // Scattered position (Act 1)
  scatteredX: number;
  scatteredY: number;
  // Connected position (Acts 2-4)
  connectedX: number;
  connectedY: number;
  // Visual
  size: number;
  shape: "circle" | "hexagon" | "diamond";
  pulsePhase: number;
}

const NODES: NodeDef[] = [
  { scatteredX: 0.12, scatteredY: 0.25, connectedX: 0.38, connectedY: 0.32, size: 18, shape: "circle", pulsePhase: 0 },
  { scatteredX: 0.85, scatteredY: 0.18, connectedX: 0.62, connectedY: 0.28, size: 22, shape: "hexagon", pulsePhase: 0.5 },
  { scatteredX: 0.35, scatteredY: 0.72, connectedX: 0.50, connectedY: 0.45, size: 28, shape: "circle", pulsePhase: 1.0 },
  { scatteredX: 0.78, scatteredY: 0.65, connectedX: 0.65, connectedY: 0.50, size: 16, shape: "diamond", pulsePhase: 1.5 },
  { scatteredX: 0.15, scatteredY: 0.55, connectedX: 0.35, connectedY: 0.50, size: 20, shape: "hexagon", pulsePhase: 2.0 },
  { scatteredX: 0.55, scatteredY: 0.15, connectedX: 0.50, connectedY: 0.25, size: 14, shape: "diamond", pulsePhase: 2.5 },
  { scatteredX: 0.92, scatteredY: 0.45, connectedX: 0.72, connectedY: 0.40, size: 24, shape: "circle", pulsePhase: 3.0 },
];

/* ── Connections (node index pairs) ── */
const CONNECTIONS = [
  [0, 2], [0, 4], [1, 2], [1, 5], [1, 6],
  [2, 3], [2, 4], [3, 6], [4, 2], [5, 2],
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
}

export default function NodeNetwork({ progress, reducedMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const progressRef = useRef(progress);
  progressRef.current = progress;



  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawHexagon = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const drawDiamond = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.7, cy);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - r * 0.7, cy);
      ctx.closePath();
    };

    const draw = (timestamp: number) => {
      const dt = timestamp - lastTime;
      lastTime = timestamp;
      timeRef.current += dt * 0.001;

      const p = progressRef.current;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      // Calculate node positions
      const nodePositions = NODES.map((node) => {
        const t = smoothstep(Math.max(0, Math.min(1, (p - 0.15) / 0.25)));
        const x = lerp(node.scatteredX * w, node.connectedX * w, t);
        const y = lerp(node.scatteredY * h, node.connectedY * h, t);

        // Add subtle floating motion
        const floatX = Math.sin(timeRef.current * 0.15 + node.pulsePhase) * (reducedMotion ? 0 : 2);
        const floatY = Math.cos(timeRef.current * 0.1 + node.pulsePhase * 1.3) * (reducedMotion ? 0 : 1.5);

        return { x: x + floatX, y: y + floatY };
      });

      // Network opacity
      const netOpacity = p < 0.02 ? p / 0.02 : p > 0.92 ? (1 - p) / 0.08 : 1;
      ctx.globalAlpha = netOpacity;

      // Draw connections
      const connOpacity = p < 0.2 ? 0 : p < 0.35 ? smoothstep((p - 0.2) / 0.15) : 1;
      if (connOpacity > 0) {
        CONNECTIONS.forEach(([fromIdx, toIdx]) => {
          const from = nodePositions[fromIdx];
          const to = nodePositions[toIdx];

          // Base line
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = `rgba(232,184,75,${connOpacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Data pulse along the line (Act 3+)
          if (p > 0.45) {
            const pulseT = (timeRef.current * 0.3 + fromIdx * 0.4) % 1;
            const pulseX = lerp(from.x, to.x, pulseT);
            const pulseY = lerp(from.y, to.y, pulseT);
            const pulseOpacity = Math.sin(pulseT * Math.PI) * connOpacity * Math.min(1, (p - 0.45) / 0.1);

            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(232,184,75,${pulseOpacity * 0.8})`;
            ctx.fill();

            // Pulse glow
            const gradient = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 12);
            gradient.addColorStop(0, `rgba(232,184,75,${pulseOpacity * 0.3})`);
            gradient.addColorStop(1, "rgba(232,184,75,0)");
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 12, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          }
        });
      }

      // Draw nodes
      const glow = p < 0.15 ? 0.3 : p < 0.5 ? lerp(0.3, 0.8, (p - 0.15) / 0.35) : lerp(0.8, 1.0, Math.min(1, (p - 0.5) / 0.5));
      NODES.forEach((node, i) => {
        const pos = nodePositions[i];
        const pulse = Math.sin(timeRef.current * 0.8 + node.pulsePhase) * 0.2 + 0.8;

        // Node glow
        const glowRadius = node.size * 2.5;
        const glowGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
        glowGradient.addColorStop(0, `rgba(232,184,75,${glow * pulse * 0.15})`);
        glowGradient.addColorStop(1, "rgba(232,184,75,0)");
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Node shape
        const isAct1 = p < 0.2;
        const borderColor = isAct1
          ? `rgba(180,100,80,${0.4 * pulse})`
          : `rgba(232,184,75,${glow * pulse * 0.7})`;
        const fillColor = isAct1
          ? `rgba(180,100,80,${0.08 * pulse})`
          : `rgba(232,184,75,${glow * pulse * 0.08})`;

        ctx.strokeStyle = borderColor;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = 1.5;

        if (node.shape === "hexagon") {
          drawHexagon(pos.x, pos.y, node.size * 0.7);
        } else if (node.shape === "diamond") {
          drawDiamond(pos.x, pos.y, node.size * 0.7);
        } else {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, node.size * 0.5, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

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
        zIndex: 10,
        pointerEvents: "none",
        opacity: reducedMotion ? 0.5 : 1,
      }}
    />
  );
}
