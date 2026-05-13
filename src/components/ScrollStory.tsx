"use client";
import { useEffect, useRef, useState } from "react";

const chapters = [
  {
    id: "ch1",
    number: "01",
    label: "THE PROBLEM",
    headline: "Most businesses bolt AI on top of broken systems.",
    body: "They buy the tools. They run the pilots. But nothing connects. The models don't talk to the data. The workflows still need humans at every step.\n\nIt works in the demo.\nIt doesn't work on Monday morning.",
    position: "center" as const,
    sky: ["#4A5A6A", "#6A7A8A", "#8A9BA8"],
    hills: ["#3D4A3D", "#4A5A4A"],
    ground: "#2A3020",
    moodOverlay: "rgba(30,40,50,0.5)",
  },
  {
    id: "ch2",
    number: "02",
    label: "THE SHIFT",
    headline: "AI doesn't need to be a feature. It can be the foundation.",
    body: "The companies winning with AI aren't using it as a chatbot. They've rebuilt how their business operates — with intelligence at the core of every workflow, decision, and system.\n\nThis is what we call AI-native.",
    position: "left" as const,
    sky: ["#FFE082", "#F9D4A0", "#F4B87A"],
    hills: ["#7BAF7A", "#5D9B5C"],
    ground: "#3D6B5E",
    moodOverlay: "rgba(200,120,20,0.1)",
  },
  {
    id: "ch3",
    number: "03",
    label: "THE ARCHITECTURE",
    headline: "We design the system before we write a single line of code.",
    body: "Architecture first. Always. We map your data flows, define your AI pipeline, and blueprint your cloud infrastructure on AWS and GCP — before anything gets built.\n\nNo surprise rewrites.\nNo technical debt out of the gate.",
    position: "right" as const,
    sky: ["#87CEEB", "#B0D9F0", "#D4EDF9"],
    hills: ["#5BAF85", "#3D8A60"],
    ground: "#2A5A40",
    moodOverlay: "rgba(0,60,80,0.15)",
  },
  {
    id: "ch4",
    number: "04",
    label: "THE RESULT",
    headline: "Then we build it. Deploy it. And make sure it actually runs.",
    body: "End-to-end. From the first architecture review to the day your AI system goes live — and beyond. We stay until it works, and works well.\n\nYour business, running intelligently.",
    position: "center" as const,
    sky: ["#F4C97A", "#E8956D", "#C97A52"],
    hills: ["#7BAF7A", "#5D9B5C"],
    ground: "#3D6B5E",
    moodOverlay: "rgba(180,80,20,0.12)",
    hasCta: true,
  },
];

function ChapterScene({ chapter }: { chapter: typeof chapters[0] }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* Sky */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${chapter.sky[0]} 0%, ${chapter.sky[1] || chapter.sky[0]} 50%, ${chapter.sky[2] || chapter.sky[0]} 100%)`,
          transition: "background 0.8s ease",
        }}
      />
      {/* Sun glow for ch2 and ch4 */}
      {(chapter.number === "02" || chapter.number === "04") && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(255,240,180,0.6) 0%, transparent 70%)",
            filter: "blur(60px)",
            zIndex: 1,
          }}
        />
      )}
      {/* Hills */}
      <svg viewBox="0 0 1440 250" preserveAspectRatio="none"
        style={{ position: "absolute", bottom: "25%", left: 0, width: "100%", zIndex: 2 }}>
        <path d="M0 250 L0 120 Q240 30 480 110 Q720 190 960 70 Q1200 -30 1440 100 L1440 250 Z"
          fill={chapter.hills[0]} />
      </svg>
      <svg viewBox="0 0 1440 200" preserveAspectRatio="none"
        style={{ position: "absolute", bottom: "12%", left: 0, width: "100%", zIndex: 3 }}>
        <path d="M0 200 L0 130 Q360 60 720 120 Q1080 180 1440 100 L1440 200 Z"
          fill={chapter.hills[1] || chapter.hills[0]} />
      </svg>
      {/* Ground */}
      <svg viewBox="0 0 1440 160" preserveAspectRatio="none"
        style={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 4 }}>
        <path d="M0 160 L0 80 Q360 40 720 80 Q1080 120 1440 60 L1440 160 Z"
          fill={chapter.ground} />
      </svg>
      {/* Mood overlay */}
      <div style={{ position: "absolute", inset: 0, background: chapter.moodOverlay, zIndex: 5 }} />
    </div>
  );
}

function ChapterCard({ chapter, active }: { chapter: typeof chapters[0]; active: boolean }) {
  const justify =
    chapter.position === "left"
      ? "flex-start"
      : chapter.position === "right"
      ? "flex-end"
      : "center";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: justify,
        padding: "0 clamp(24px, 6vw, 80px)",
        opacity: active ? 1 : 0,
        transform: active ? "translateX(0)" : chapter.position === "right" ? "translateX(60px)" : "translateX(-60px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        pointerEvents: active ? "auto" : "none",
      }}
    >
      <div
        className="glass-card"
        style={{
          padding: "clamp(32px, 4vw, 52px)",
          maxWidth: "520px",
          width: "100%",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 64px rgba(0,0,0,0.4)",
        }}
      >
        {/* Label */}
        <div className="label-tag" style={{ marginBottom: "20px" }}>
          CHAPTER {chapter.number} — {chapter.label}
        </div>

        {/* Headline */}
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(26px, 3.5vw, 42px)",
            fontWeight: 500,
            color: "var(--text-on-card)",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}
        >
          {chapter.headline}
        </h2>

        {/* Body */}
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "32px", whiteSpace: "pre-line" }}>
          {chapter.body}
        </p>

        {/* CTA or scroll indicator */}
        {chapter.hasCta ? (
          <a href="#contact" className="btn-primary">Start a Project →</a>
        ) : (
          <div className="scroll-indicator">
            <span className="pulse-slow">SCROLL</span>
            <div className="scroll-dashes">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`scroll-dash ${i === 0 ? "active" : ""}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScrollStory() {
  const [activeChapter, setActiveChapter] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = chapters.map((_, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveChapter(i); },
        { threshold: 0.5 }
      );
      if (sectionRefs.current[i]) obs.observe(sectionRefs.current[i]!);
      return obs;
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <section id="story" style={{ position: "relative" }}>
      {/* Chapter label */}
      <div style={{ position: "sticky", top: "16px", zIndex: 30, textAlign: "center", pointerEvents: "none" }}>
        <div className="label-tag" style={{ display: "inline-block", background: "rgba(20,18,14,0.7)", padding: "6px 16px", borderRadius: "100px", backdropFilter: "blur(10px)" }}>
          The Story
        </div>
      </div>

      {chapters.map((chapter, i) => (
        <div
          key={chapter.id}
          ref={(el) => { sectionRefs.current[i] = el; }}
          className="chapter-section"
          style={{ height: "100vh" }}
        >
          <ChapterScene chapter={chapter} />
          <ChapterCard chapter={chapter} active={activeChapter === i} />
        </div>
      ))}
    </section>
  );
}
