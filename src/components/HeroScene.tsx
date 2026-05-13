"use client";
import dynamic from "next/dynamic";

const ParticlesCanvas = dynamic(() => import("./ParticlesCanvas"), { ssr: false });

// SVG Birds
function Birds() {
  return (
    <svg
      viewBox="0 0 200 80"
      style={{ position: "absolute", top: "14%", right: "10%", width: "180px", opacity: 0.45, zIndex: 3 }}
      fill="none"
    >
      <path d="M10 40 Q20 30 30 40" stroke="#4A3020" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M50 30 Q62 18 74 30" stroke="#4A3020" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M90 22 Q100 12 110 22" stroke="#4A3020" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M140 35 Q148 26 156 35" stroke="#4A3020" strokeWidth="1" strokeLinecap="round" />
      <path d="M170 20 Q176 13 182 20" stroke="#4A3020" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

// Sun glow
function SunGlow() {
  return (
    <div
      style={{
        position: "absolute",
        top: "12%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "520px",
        height: "520px",
        background: "radial-gradient(circle, rgba(255,240,200,0.55) 0%, transparent 70%)",
        filter: "blur(50px)",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}

export default function HeroScene() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* Sky */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, #F9D4A0 0%, #F4B87A 28%, #E8956D 65%, #C97A52 100%)",
          zIndex: 0,
        }}
      />

      <SunGlow />

      {/* Far mountains */}
      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: "38%", left: 0, width: "100%", height: "auto", zIndex: 3, opacity: 0.7 }}
      >
        <path
          d="M0 300 L0 180 Q120 80 240 150 Q320 200 400 100 Q500 10 600 120 Q680 200 760 80 Q860 -20 960 100 Q1060 200 1140 120 Q1240 40 1340 160 L1440 200 L1440 300 Z"
          fill="#8BA3B8"
        />
        <path
          d="M0 300 L0 220 Q80 160 180 200 Q260 230 340 160 Q420 90 520 180 Q620 260 720 160 Q820 60 940 180 Q1040 280 1140 200 Q1260 120 1380 220 L1440 240 L1440 300 Z"
          fill="#A3B9C8"
          opacity="0.6"
        />
      </svg>

      {/* Mid hills */}
      <svg
        viewBox="0 0 1440 280"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: "22%", left: 0, width: "100%", height: "auto", zIndex: 4 }}
      >
        <path
          d="M0 280 L0 160 Q180 60 360 130 Q540 200 720 100 Q900 10 1080 120 Q1260 220 1440 130 L1440 280 Z"
          fill="#7BAF7A"
        />
        <path
          d="M0 280 L0 200 Q150 140 300 170 Q450 200 600 150 Q750 100 900 160 Q1050 220 1200 170 Q1320 130 1440 180 L1440 280 Z"
          fill="#5D9B5C"
          opacity="0.8"
        />
      </svg>

      {/* Foreground ground */}
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "auto", zIndex: 5 }}
      >
        <path
          d="M0 200 L0 100 Q200 60 400 90 Q600 120 720 70 Q900 20 1100 80 Q1300 130 1440 90 L1440 200 Z"
          fill="#3D6B5E"
        />
        <path
          d="M0 200 L0 140 Q300 100 600 130 Q900 160 1200 120 Q1340 100 1440 130 L1440 200 Z"
          fill="#2A4D44"
        />
      </svg>

      {/* Extra warm tones overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(0deg, rgba(90,62,43,0.45) 0%, transparent 40%)",
          zIndex: 6,
          pointerEvents: "none",
        }}
      />

      <Birds />
      <ParticlesCanvas />
    </div>
  );
}
