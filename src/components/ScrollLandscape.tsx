"use client";
import { useMemo } from "react";

interface Palette {
  skyTop: string;
  skyMid: string;
  skyBot: string;
  farMountain: string;
  nearMountain: string;
  hillFront: string;
  hillBack: string;
  ground: string;
  groundDeep: string;
  fogOpacity: number;
  sunOpacity: number;
  sunSize: number;
  ambientLight: number;
}

interface Props {
  palette: Palette;
  progress: number;
  reducedMotion: boolean;
}

/* ── Parallax speed multipliers ── */
const PARALLAX = {
  sky: 0.05,
  sun: 0.1,
  farMountains: 0.25,
  nearMountains: 0.45,
  hillBack: 0.65,
  hillFront: 0.85,
  ground: 1.1,
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function ScrollLandscape({ palette, progress, reducedMotion }: Props) {
  // Calculate parallax offsets
  const offsets = useMemo(() => {
    if (reducedMotion) {
      return { sky: 0, sun: 0, farMountains: 0, nearMountains: 0, hillBack: 0, hillFront: 0, ground: 0 };
    }
    const maxShift = 450; // max pixel shift over full scroll
    return {
      sky: progress * maxShift * PARALLAX.sky,
      sun: progress * maxShift * PARALLAX.sun,
      farMountains: progress * maxShift * PARALLAX.farMountains,
      nearMountains: progress * maxShift * PARALLAX.nearMountains,
      hillBack: progress * maxShift * PARALLAX.hillBack,
      hillFront: progress * maxShift * PARALLAX.hillFront,
      ground: progress * maxShift * PARALLAX.ground,
    };
  }, [progress, reducedMotion]);

  // Blueprint grid opacity — visible mainly in Act 2-3
  const gridOpacity = useMemo(() => {
    if (progress < 0.2) return 0;
    if (progress < 0.35) return (progress - 0.2) / 0.15 * 0.12;
    if (progress < 0.65) return 0.12;
    if (progress < 0.8) return 0.12 * (1 - (progress - 0.65) / 0.15);
    return 0;
  }, [progress]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* L0: Sky gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${palette.skyTop} 0%, ${palette.skyMid} 45%, ${palette.skyBot} 100%)`,
          transform: `translateY(${-offsets.sky}px)`,
          zIndex: 0,
          willChange: "background",
        }}
      />

      {/* L1: Sun glow */}
      <div
        style={{
          position: "absolute",
          top: `${lerp(15, 8, progress)}%`,
          left: "50%",
          transform: `translateX(-50%) translateY(${-offsets.sun}px)`,
          width: `${palette.sunSize}px`,
          height: `${palette.sunSize}px`,
          background: `radial-gradient(circle, 
            rgba(255,240,200,${palette.sunOpacity}) 0%, 
            rgba(255,220,150,${palette.sunOpacity * 0.5}) 30%,
            transparent 70%)`,
          filter: "blur(40px)",
          zIndex: 1,
          pointerEvents: "none",
          willChange: "transform, opacity",
        }}
      />

      {/* Secondary sun corona */}
      <div
        style={{
          position: "absolute",
          top: `${lerp(18, 10, progress)}%`,
          left: "50%",
          transform: `translateX(-50%) translateY(${-offsets.sun * 0.8}px)`,
          width: `${palette.sunSize * 1.6}px`,
          height: `${palette.sunSize * 1.6}px`,
          background: `radial-gradient(circle, 
            rgba(255,220,140,${palette.sunOpacity * 0.2}) 0%, 
            transparent 60%)`,
          filter: "blur(80px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* L2: Far mountains */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: `${lerp(36, 40, progress)}%`,
          left: 0,
          width: "110%",
          marginLeft: "-5%",
          height: "auto",
          zIndex: 3,
          opacity: lerp(0.5, 0.85, progress),
          transform: `translateY(${-offsets.farMountains}px)`,
          willChange: "transform",
        }}
      >
        <path
          d="M0 320 L0 200 Q100 100 200 160 Q300 220 400 120 Q480 40 580 130 Q680 220 780 90 Q880 -20 1000 110 Q1100 200 1200 130 Q1300 60 1400 170 L1540 210 L1540 320 Z"
          fill={palette.farMountain}
        />
        <path
          d="M0 320 L0 240 Q80 170 180 210 Q260 240 360 170 Q440 100 540 190 Q640 270 740 170 Q840 70 960 190 Q1060 290 1160 210 Q1280 130 1400 230 L1540 260 L1540 320 Z"
          fill={palette.nearMountain}
          opacity="0.55"
        />
      </svg>

      {/* Blueprint grid overlay (Acts 2-3) */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: 0,
          right: 0,
          height: "50%",
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(rgba(232,184,75,0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,184,75,0.25) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translateY(${-offsets.nearMountains}px) perspective(800px) rotateX(55deg)`,
          transformOrigin: "center bottom",
          zIndex: 3,
          pointerEvents: "none",
          maskImage: "linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%)",
        }}
      />

      {/* L3: Mid hills - back */}
      <svg
        viewBox="0 0 1440 280"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: `${lerp(20, 26, progress)}%`,
          left: 0,
          width: "115%",
          marginLeft: "-7.5%",
          height: "auto",
          zIndex: 4,
          transform: `translateY(${-offsets.hillBack}px)`,
          willChange: "transform",
        }}
      >
        <path
          d="M0 280 L0 140 Q200 40 400 120 Q600 200 800 80 Q1000 -20 1200 100 Q1400 200 1580 110 L1580 280 Z"
          fill={palette.hillBack}
        />
      </svg>

      {/* L4: Mid hills - front */}
      <svg
        viewBox="0 0 1440 250"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: `${lerp(10, 16, progress)}%`,
          left: 0,
          width: "120%",
          marginLeft: "-10%",
          height: "auto",
          zIndex: 5,
          transform: `translateY(${-offsets.hillFront}px)`,
          willChange: "transform",
        }}
      >
        <path
          d="M0 250 L0 160 Q180 70 360 130 Q540 190 720 100 Q900 20 1080 120 Q1260 210 1540 110 L1540 250 Z"
          fill={palette.hillFront}
        />
        <path
          d="M0 250 L0 190 Q150 130 300 170 Q480 210 660 150 Q840 90 1020 160 Q1200 220 1400 160 L1540 180 L1540 250 Z"
          fill={palette.hillFront}
          opacity="0.7"
          style={{ filter: "brightness(0.85)" }}
        />
      </svg>

      {/* L5: Ground */}
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "125%",
          marginLeft: "-12.5%",
          height: "auto",
          zIndex: 6,
          transform: `translateY(${-offsets.ground}px)`,
          willChange: "transform",
        }}
      >
        <path
          d="M0 200 L0 90 Q200 50 400 80 Q600 110 740 65 Q920 15 1120 70 Q1320 120 1580 80 L1580 200 Z"
          fill={palette.ground}
        />
        <path
          d="M0 200 L0 130 Q300 90 600 120 Q900 150 1200 110 Q1400 85 1580 120 L1580 200 Z"
          fill={palette.groundDeep}
        />
      </svg>

      {/* Ground atmosphere overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: `linear-gradient(0deg, 
            rgba(${progress < 0.3 ? "30,40,30" : "90,62,43"},${lerp(0.5, 0.2, progress)}) 0%, 
            transparent 100%)`,
          zIndex: 7,
          pointerEvents: "none",
        }}
      />

      {/* SVG Birds (visible in acts 2-4) */}
      <svg
        viewBox="0 0 200 80"
        style={{
          position: "absolute",
          top: `${lerp(20, 12, progress)}%`,
          right: `${lerp(5, 15, progress)}%`,
          width: "160px",
          opacity: progress > 0.2 ? Math.min(0.4, (progress - 0.2) * 2) : 0,
          zIndex: 3,
          transform: `translateY(${-offsets.sun * 0.5}px) translateX(${progress * 30}px)`,
          transition: "opacity 0.6s ease",
        }}
        fill="none"
      >
        <path d="M10 40 Q20 30 30 40" stroke="rgba(60,40,25,0.8)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50 30 Q62 18 74 30" stroke="rgba(60,40,25,0.8)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M90 22 Q100 12 110 22" stroke="rgba(60,40,25,0.6)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M140 35 Q148 26 156 35" stroke="rgba(60,40,25,0.5)" strokeWidth="1" strokeLinecap="round" />
        <path d="M170 20 Q176 13 182 20" stroke="rgba(60,40,25,0.4)" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}
