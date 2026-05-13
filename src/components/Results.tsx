"use client";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1500, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

const stats = [
  { value: 12, suffix: "+", label: "AI Systems\nDeployed" },
  { value: 6, suffix: " Weeks", label: "Avg. Time to\nProduction" },
  { value: 100, suffix: "%", label: "Cloud-Native\nFrom Day One" },
];

const testimonials = [
  {
    quote: "They didn't just build what we asked for — they showed us what we actually needed. The system they designed processes 40,000 events a day without a single human touchpoint.",
    name: "PRIYA SHARMA",
    role: "CTO, Series B Fintech",
  },
  {
    quote: "Most agencies want to start coding immediately. These guys made us slow down, think through the architecture first, and it saved us months of technical debt.",
    name: "JAMES OKAFOR",
    role: "Head of Engineering, Growth-Stage SaaS",
  },
];

export default function Results() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const c0 = useCountUp(stats[0].value, 1500, active);
  const c1 = useCountUp(stats[1].value, 1500, active);
  const c2 = useCountUp(stats[2].value, 1500, active);
  const counts = [c0, c1, c2];

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="results"
      ref={sectionRef}
      style={{
        background: "var(--bg-dark)",
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "12px" }}>
          <span className="label-tag">The Numbers Speak</span>
        </div>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 500, color: "var(--text-on-card)", marginBottom: "72px" }}
        >
          Results that matter.
        </h2>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "48px",
            marginBottom: "96px",
          }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label}>
              <div className="stat-number">
                {counts[i]}{stat.suffix}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginTop: "12px",
                  whiteSpace: "pre-line",
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="glass-card"
              style={{
                padding: "40px",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.3)",
              }}
            >
              {/* Quote mark */}
              <div
                className="font-display"
                style={{ fontSize: "72px", lineHeight: 0.8, color: "var(--accent-gold)", opacity: 0.4, marginBottom: "20px" }}
              >
                &ldquo;
              </div>
              <p className="testimonial-quote" style={{ marginBottom: "32px" }}>{t.quote}</p>
              <div style={{ borderTop: "1px solid rgba(255,210,140,0.15)", paddingTop: "24px" }}>
                <div className="label-tag" style={{ display: "block", marginBottom: "4px" }}>{t.name}</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
