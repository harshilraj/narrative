"use client";
import { useEffect, useRef } from "react";

// SVG Icons
function NeuralIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="4" stroke="#E8B84B" strokeWidth="1.5" />
      <circle cx="8"  cy="10" r="2.5" stroke="#E8B84B" strokeWidth="1.2" />
      <circle cx="32" cy="10" r="2.5" stroke="#E8B84B" strokeWidth="1.2" />
      <circle cx="8"  cy="30" r="2.5" stroke="#E8B84B" strokeWidth="1.2" />
      <circle cx="32" cy="30" r="2.5" stroke="#E8B84B" strokeWidth="1.2" />
      <line x1="10" y1="11"  x2="17" y2="18" stroke="#E8B84B" strokeWidth="1" opacity="0.6" />
      <line x1="30" y1="11"  x2="23" y2="18" stroke="#E8B84B" strokeWidth="1" opacity="0.6" />
      <line x1="10" y1="29"  x2="17" y2="22" stroke="#E8B84B" strokeWidth="1" opacity="0.6" />
      <line x1="30" y1="29"  x2="23" y2="22" stroke="#E8B84B" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M10 26 C6 26 4 22 6 18 C8 14 13 13 16 16 C17 11 22 8 27 10 C32 12 34 18 31 22 C33 22 35 24 34 27 C33 29 30 30 28 28 L12 28 C10 30 7 29 10 26 Z"
        stroke="#E8B84B" strokeWidth="1.5" fill="none" />
      <line x1="15" y1="33" x2="15" y2="28" stroke="#E8B84B" strokeWidth="1.2" />
      <line x1="20" y1="35" x2="20" y2="28" stroke="#E8B84B" strokeWidth="1.2" />
      <line x1="25" y1="33" x2="25" y2="28" stroke="#E8B84B" strokeWidth="1.2" />
    </svg>
  );
}

function FlowIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="4"  y="16" width="10" height="8" rx="2" stroke="#E8B84B" strokeWidth="1.5" />
      <rect x="26" y="8"  width="10" height="8" rx="2" stroke="#E8B84B" strokeWidth="1.5" />
      <rect x="26" y="24" width="10" height="8" rx="2" stroke="#E8B84B" strokeWidth="1.5" />
      <line x1="14" y1="20" x2="22" y2="12" stroke="#E8B84B" strokeWidth="1.2" />
      <line x1="14" y1="20" x2="22" y2="28" stroke="#E8B84B" strokeWidth="1.2" />
      <polygon points="22,10 26,12 22,14" fill="#E8B84B" opacity="0.8" />
      <polygon points="22,26 26,28 22,30" fill="#E8B84B" opacity="0.8" />
    </svg>
  );
}

const services = [
  {
    icon: <NeuralIcon />,
    title: "AI System Design",
    body: "We architect AI pipelines from the ground up. RAG systems, LLM agents, multi-step workflows — designed to handle real production load, not just demos.",
    tags: ["LLM Integration", "RAG", "Agents", "MLOps"],
    href: "#services",
  },
  {
    icon: <CloudIcon />,
    title: "AWS & GCP Infrastructure",
    body: "Cloud-native infrastructure built for scale. We design serverless systems, container orchestration, and data platforms that handle whatever you throw at them.",
    tags: ["AWS", "GCP", "Terraform", "Kubernetes"],
    href: "#services",
  },
  {
    icon: <FlowIcon />,
    title: "Intelligent Automation",
    body: "We identify where human time is being wasted and replace repetitive decision-making with AI workflows that run 24/7 without supervision.",
    tags: ["Process Automation", "AI Agents", "Integrations"],
    href: "#services",
  },
];

export default function Services() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll(".reveal");
    if (!cards) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("visible"), i * 100);
        }
      }),
      { threshold: 0.15 }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="services"
      style={{
        background: "var(--bg-warm-white)",
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: "16px" }}>
          <span className="label-tag" style={{ color: "var(--accent-gold)" }}>What We Build</span>
        </div>
        <div className="reveal" style={{ marginBottom: "20px" }}>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 500, color: "var(--text-dark)", lineHeight: 1.15 }}
          >
            Built for production,<br />not presentations.
          </h2>
        </div>
        <div className="reveal" style={{ marginBottom: "64px" }}>
          <p style={{ fontSize: "17px", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: "540px" }}>
            Every engagement is designed end-to-end — from strategy to production.
          </p>
        </div>

        {/* Cards grid */}
        <div
          ref={cardsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {services.map((svc) => (
            <div
              key={svc.title}
              className="glass-card service-card reveal"
              style={{
                background: "var(--bg-dark)",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div>{svc.icon}</div>
              <h3
                className="font-display"
                style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-on-card)", lineHeight: 1.3 }}
              >
                {svc.title}
              </h3>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.75, flex: 1 }}>
                {svc.body}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {svc.tags.map((tag) => (
                  <span key={tag} className="tag-chip">{tag}</span>
                ))}
              </div>
              <a
                href={svc.href}
                style={{ color: "var(--accent-gold)", fontSize: "14px", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
