"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ScrollLandscape = dynamic(() => import("./ScrollLandscape"), { ssr: false });
const NodeNetwork = dynamic(() => import("./NodeNetwork"), { ssr: false });
const ScrollParticles = dynamic(() => import("./ScrollParticles"), { ssr: false });

/* ── Chapter Data ── */
const chapters = [
  {
    id: "ch1",
    number: "01",
    label: "THE PROBLEM",
    headline: "Most businesses bolt AI on top of broken systems.",
    body: "They buy the tools. They run the pilots. But nothing connects. The models don\u2019t talk to the data. The workflows still need humans at every step.\n\nIt works in the demo.\nIt doesn\u2019t work on Monday morning.",
    position: "left" as const,
  },
  {
    id: "ch2",
    number: "02",
    label: "THE SHIFT",
    headline: "AI doesn\u2019t need to be a feature.\nIt can be the foundation.",
    body: "The companies winning with AI aren\u2019t using it as a chatbot. They\u2019ve rebuilt how their business operates \u2014 with intelligence at the core of every workflow, decision, and system.\n\nThis is what we call AI-native.",
    position: "right" as const,
  },
  {
    id: "ch3",
    number: "03",
    label: "THE ARCHITECTURE",
    headline: "We design the system before we write a single line of code.",
    body: "Architecture first. Always. We map your data flows, define your AI pipeline, and blueprint your cloud infrastructure on AWS and GCP \u2014 before anything gets built.\n\nNo surprise rewrites.\nNo technical debt out of the gate.",
    position: "left" as const,
  },
  {
    id: "ch4",
    number: "04",
    label: "THE RESULT",
    headline: "Then we build it. Deploy it.\nAnd make sure it actually runs.",
    body: "End-to-end. From the first architecture review to the day your AI system goes live \u2014 and beyond. We stay until it works, and works well.\n\nYour business, running intelligently.",
    position: "center" as const,
    hasCta: true,
  },
];

/* ── Act color palettes ── */
const actPalettes = [
  { // Act 1: Fragmented Chaos — storm, tension, broken systems
    skyTop: "#1E252E", skyMid: "#2D3A48", skyBot: "#3E4E5E",
    farMountain: "#2A3540", nearMountain: "#253038",
    hillFront: "#1A2820", hillBack: "#1E3025",
    ground: "#121C15", groundDeep: "#0D140F",
    fogOpacity: 0.85, sunOpacity: 0, sunSize: 200,
    particleColor: [160, 110, 80], particleOpacity: 0.18,
    ambientLight: 0.12,
  },
  { // Act 2: Architecture Emerges
    skyTop: "#F9D4A0", skyMid: "#F4B87A", skyBot: "#E8956D",
    farMountain: "#8BA3B8", nearMountain: "#A3B9C8",
    hillFront: "#7BAF7A", hillBack: "#5D9B5C",
    ground: "#3D6B5E", groundDeep: "#2A4D44",
    fogOpacity: 0.25, sunOpacity: 0.55, sunSize: 520,
    particleColor: [255, 220, 150], particleOpacity: 0.45,
    ambientLight: 0.65,
  },
  { // Act 3: The Build
    skyTop: "#87CEEB", skyMid: "#B0D9F0", skyBot: "#D4EDF9",
    farMountain: "#6A9AB8", nearMountain: "#8BB8D0",
    hillFront: "#5BAF85", hillBack: "#3D8A60",
    ground: "#2A5A40", groundDeep: "#1E3F2E",
    fogOpacity: 0.08, sunOpacity: 0.35, sunSize: 400,
    particleColor: [230, 200, 100], particleOpacity: 0.5,
    ambientLight: 0.85,
  },
  { // Act 4: Launch & Scale
    skyTop: "#F4C97A", skyMid: "#E8956D", skyBot: "#C97A52",
    farMountain: "#7BA098", nearMountain: "#8BB0A8",
    hillFront: "#7BAF7A", hillBack: "#5D9B5C",
    ground: "#3D6B5E", groundDeep: "#2A4D44",
    fogOpacity: 0.04, sunOpacity: 0.75, sunSize: 650,
    particleColor: [255, 240, 180], particleOpacity: 0.55,
    ambientLight: 1.0,
  },
];

/* ── Lerp helpers ── */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(a: string, b: string, t: number): string {
  const parseHex = (hex: string) => {
    const c = hex.replace("#", "");
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parseHex(a);
  const [r2, g2, b2] = parseHex(b);
  const r = Math.round(lerp(r1, r2, t));
  const g = Math.round(lerp(g1, g2, t));
  const blue = Math.round(lerp(b1, b2, t));
  return `rgb(${r},${g},${blue})`;
}

function smoothstep(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
}

/* ── Interpolated palette ── */
function getInterpolatedPalette(progress: number) {
  const totalActs = actPalettes.length;
  const scaledProgress = progress * (totalActs - 1);
  const actIndex = Math.min(Math.floor(scaledProgress), totalActs - 2);
  const localT = smoothstep(scaledProgress - actIndex);
  const a = actPalettes[actIndex];
  const b = actPalettes[actIndex + 1];

  return {
    skyTop: lerpColor(a.skyTop, b.skyTop, localT),
    skyMid: lerpColor(a.skyMid, b.skyMid, localT),
    skyBot: lerpColor(a.skyBot, b.skyBot, localT),
    farMountain: lerpColor(a.farMountain, b.farMountain, localT),
    nearMountain: lerpColor(a.nearMountain, b.nearMountain, localT),
    hillFront: lerpColor(a.hillFront, b.hillFront, localT),
    hillBack: lerpColor(a.hillBack, b.hillBack, localT),
    ground: lerpColor(a.ground, b.ground, localT),
    groundDeep: lerpColor(a.groundDeep, b.groundDeep, localT),
    fogOpacity: lerp(a.fogOpacity, b.fogOpacity, localT),
    sunOpacity: lerp(a.sunOpacity, b.sunOpacity, localT),
    sunSize: lerp(a.sunSize, b.sunSize, localT),
    particleColor: [
      lerp(a.particleColor[0], b.particleColor[0], localT),
      lerp(a.particleColor[1], b.particleColor[1], localT),
      lerp(a.particleColor[2], b.particleColor[2], localT),
    ] as [number, number, number],
    particleOpacity: lerp(a.particleOpacity, b.particleOpacity, localT),
    ambientLight: lerp(a.ambientLight, b.ambientLight, localT),
  };
}

/* ── Active chapter from progress ── */
function getActiveChapter(progress: number): number {
  if (progress < 0.25) return 0;
  if (progress < 0.5) return 1;
  if (progress < 0.75) return 2;
  return 3;
}

/* ── Chapter Card ── */
function ChapterCard({
  chapter,
  active,
  index,
}: {
  chapter: typeof chapters[0];
  active: boolean;
  index: number;
}) {
  const justify =
    chapter.position === "left"
      ? "flex-start"
      : chapter.position === "right"
      ? "flex-end"
      : "center";

  const slideDir = chapter.position === "right" ? 80 : chapter.position === "left" ? -80 : 0;

  return (
    <div
      className="cinematic-card-container"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: justify,
        padding: "0 clamp(24px, 6vw, 80px)",
        opacity: active ? 1 : 0,
        transform: active
          ? "translateX(0) translateY(0) scale(1)"
          : `translateX(${slideDir}px) translateY(20px) scale(0.97)`,
        transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: active ? "auto" : "none",
      }}
    >
      <div
        className="glass-card"
        style={{
          padding: "clamp(32px, 4vw, 52px)",
          maxWidth: "540px",
          width: "100%",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.45), 0 0 120px rgba(232,184,75,0.06)",
        }}
      >
        {/* Chapter label */}
        <div className="label-tag" style={{ marginBottom: "20px" }}>
          CHAPTER {chapter.number} — {chapter.label}
        </div>

        {/* Headline */}
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(24px, 3.2vw, 40px)",
            fontWeight: 500,
            color: "var(--text-on-card)",
            lineHeight: 1.2,
            marginBottom: "24px",
            whiteSpace: "pre-line",
          }}
        >
          {chapter.headline}
        </h2>

        {/* Body */}
        <p
          style={{
            fontSize: "15px",
            color: "var(--text-secondary)",
            lineHeight: 1.8,
            marginBottom: "32px",
            whiteSpace: "pre-line",
          }}
        >
          {chapter.body}
        </p>

        {/* CTA or scroll hint */}
        {chapter.hasCta ? (
          <a href="#contact" className="btn-primary">
            Start a Project →
          </a>
        ) : (
          <div className="scroll-indicator">
            <span className="pulse-slow">SCROLL</span>
            <div className="scroll-dashes">
              {chapters.map((_, i) => (
                <div
                  key={i}
                  className={`scroll-dash ${i === index ? "active" : ""}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Chapter Progress Indicator ── */
function ChapterIndicator({ activeChapter, progress }: { activeChapter: number; progress: number }) {
  return (
    <div
      className="cinematic-chapter-indicator"
      style={{
        position: "absolute",
        right: "clamp(16px, 3vw, 40px)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 25,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "center",
      }}
    >
      {chapters.map((ch, i) => (
        <div
          key={ch.id}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            opacity: i === activeChapter ? 1 : 0.35,
            transition: "opacity 0.6s ease",
          }}
        >
          <div
            style={{
              width: i === activeChapter ? "3px" : "2px",
              height: i === activeChapter ? "32px" : "16px",
              background: i === activeChapter ? "var(--accent-gold)" : "rgba(200,187,168,0.5)",
              borderRadius: "2px",
              transition: "all 0.6s ease",
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: i === activeChapter ? "var(--accent-gold)" : "rgba(200,187,168,0.4)",
              writingMode: "vertical-lr",
              textOrientation: "mixed",
              transition: "color 0.6s ease",
            }}
          >
            {ch.number}
          </span>
        </div>
      ))}

      {/* Overall progress bar */}
      <div
        style={{
          width: "2px",
          height: "60px",
          background: "rgba(200,187,168,0.15)",
          borderRadius: "2px",
          marginTop: "8px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${progress * 100}%`,
            background: "var(--accent-gold)",
            borderRadius: "2px",
            transition: "height 0.1s linear",
          }}
        />
      </div>
    </div>
  );
}

/* ── Main Cinematic Scroll ── */
export default function CinematicScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rafRef = useRef<number>(0);
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Smooth scroll tracking with GSAP-like interpolation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateProgress = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const raw = Math.max(0, Math.min(1, scrolled / containerHeight));
      targetProgressRef.current = raw;
    };

    const animate = () => {
      const smoothing = reducedMotion ? 1 : 0.06;
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * smoothing;

      // Avoid unnecessary re-renders
      const rounded = Math.round(currentProgressRef.current * 10000) / 10000;
      if (Math.abs(rounded - progress) > 0.0005) {
        setProgress(rounded);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      cancelAnimationFrame(rafRef.current);
    };
  }, [progress, reducedMotion]);

  const palette = getInterpolatedPalette(progress);
  const activeChapter = getActiveChapter(progress);

  // Camera transforms based on progress
  const cameraScale = reducedMotion ? 1 : lerp(1.18, 0.9, smoothstep(progress));
  const cameraPanX = reducedMotion ? 0 : lerp(-35, 35, smoothstep(progress));
  const cameraPanY = reducedMotion ? 0 : lerp(25, -45, smoothstep(progress));

  return (
    <section
      id="story"
      ref={containerRef}
      className="cinematic-scroll-container"
      style={{ position: "relative", height: "500vh" }}
    >
      {/* Sticky viewport */}
      <div
        ref={viewportRef}
        className="cinematic-viewport"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        {/* Camera wrapper — simulates camera pan/zoom */}
        <div
          className="cinematic-camera"
          style={{
            position: "absolute",
            inset: "-5%",
            width: "110%",
            height: "110%",
            transform: `scale(${cameraScale}) translate(${cameraPanX}px, ${cameraPanY}px)`,
            transition: reducedMotion ? "none" : undefined,
            willChange: "transform",
          }}
        >
          {/* Landscape layers */}
          <ScrollLandscape palette={palette} progress={progress} reducedMotion={reducedMotion} />

          {/* Floating node network */}
          <NodeNetwork progress={progress} reducedMotion={reducedMotion} />

          {/* Enhanced particles */}
          <ScrollParticles palette={palette} progress={progress} reducedMotion={reducedMotion} />
        </div>

        {/* Atmospheric fog layers */}
        <div
          className="cinematic-fog-top"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, 
              rgba(20,28,35,${palette.fogOpacity * 0.7}) 0%, 
              rgba(40,50,55,${palette.fogOpacity * 0.3}) 25%,
              transparent 45%,
              rgba(20,30,20,${palette.fogOpacity * 0.5}) 75%,
              rgba(10,15,10,${palette.fogOpacity * 0.9}) 100%)`,
            zIndex: 12,
            pointerEvents: "none",
            transition: reducedMotion ? "background 0.6s ease" : undefined,
          }}
        />

        {/* Vignette — stronger in Act 1 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent ${lerp(35, 55, progress)}%, rgba(0,0,0,${lerp(0.5, 0.3, progress)}) 100%)`,
            zIndex: 13,
            pointerEvents: "none",
          }}
        />

        {/* Film grain texture for cinematic feel */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: lerp(0.06, 0.02, progress),
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
            zIndex: 14,
            pointerEvents: "none",
            mixBlendMode: "overlay",
          }}
        />

        {/* Static interference lines (Act 1 only) */}
        {progress < 0.3 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: Math.max(0, (0.3 - progress) / 0.3) * 0.08,
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255,200,150,0.15) 2px,
                rgba(255,200,150,0.15) 3px
              )`,
              backgroundSize: "100% 120px",
              zIndex: 14,
              pointerEvents: "none",
              animation: "none",
            }}
          />
        )}

        {/* Chapter cards */}
        {chapters.map((chapter, i) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            active={activeChapter === i}
            index={i}
          />
        ))}

        {/* Chapter progress indicator */}
        <ChapterIndicator activeChapter={activeChapter} progress={progress} />

        {/* Sticky chapter label */}
        <div
          style={{
            position: "absolute",
            top: "clamp(80px, 10vh, 100px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <div
            className="label-tag"
            style={{
              display: "inline-block",
              background: "rgba(20,18,14,0.65)",
              padding: "6px 18px",
              borderRadius: "100px",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(232,184,75,0.15)",
            }}
          >
            The Story
          </div>
        </div>
      </div>
    </section>
  );
}
