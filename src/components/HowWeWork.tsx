"use client";
import { useEffect, useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Discovery",
    body: "We spend the first week understanding your business, your data, and where AI can genuinely move the needle. No assumptions. No templates.",
  },
  {
    num: "02",
    title: "Blueprint",
    body: "We produce a full technical architecture document: AI pipeline design, cloud topology, cost modeling, and a delivery timeline. You approve before we build.",
  },
  {
    num: "03",
    title: "Build & Deploy",
    body: "We build on AWS/GCP using infrastructure-as-code, CI/CD pipelines, and automated testing. You see progress every week — no black boxes.",
  },
  {
    num: "04",
    title: "Scale & Optimize",
    body: "We don't disappear after launch. We monitor, optimize, and evolve your system as your business grows. AI that gets smarter over time.",
  },
];

export default function HowWeWork() {
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = stepsRef.current?.querySelectorAll(".reveal");
    if (!items) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 120);
      }),
      { threshold: 0.1 }
    );
    items.forEach((item) => obs.observe(item));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="work"
      style={{
        background: "var(--bg-cream)",
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: "12px" }}>
          <span className="label-tag">How a Project Works</span>
        </div>
        <h2
          className="font-display reveal"
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 500,
            color: "var(--text-dark)",
            marginBottom: "72px",
            lineHeight: 1.15,
          }}
        >
          Four phases.<br />Zero guesswork.
        </h2>

        {/* Steps */}
        <div
          ref={stepsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "40px",
          }}
        >
          {steps.map((step) => (
            <div
              key={step.num}
              className="reveal"
              style={{ position: "relative", paddingTop: "40px" }}
            >
              {/* Watermark number */}
              <div
                className="watermark-number"
                style={{ fontSize: "clamp(80px, 10vw, 140px)" }}
              >
                {step.num}
              </div>

              {/* Content */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  className="label-tag"
                  style={{ marginBottom: "16px", display: "block" }}
                >
                  {step.num}
                </div>
                <h3
                  className="font-display"
                  style={{
                    fontSize: "24px",
                    fontWeight: 500,
                    color: "var(--text-dark)",
                    marginBottom: "16px",
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.8 }}>
                  {step.body}
                </p>
              </div>

              {/* Divider line (top) */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "rgba(26,23,18,0.12)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
