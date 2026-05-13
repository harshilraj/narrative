"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  {
    id: "01",
    label: "Core Layer",
    title: "Workflow Orchestration",
    desc: "Inbound work is classified, routed, and prepared for the right model, tool, or human review path.",
    accent: "#5B8EF0",
    tags: ["LLM Routing", "RAG Pipelines", "Vector Retrieval"],
    icon: "◈",
  },
  {
    id: "02",
    label: "Automation Layer",
    title: "Process Automation",
    desc: "Repeated decisions become durable background workflows with clear states, fallbacks, and audit trails.",
    accent: "#8B6CF0",
    tags: ["API Integration", "Event Streaming", "Kafka"],
    icon: "◎",
  },
  {
    id: "03",
    label: "Infrastructure Layer",
    title: "Cloud Architecture",
    desc: "AWS and GCP services are shaped around latency, privacy, observability, and predictable production cost.",
    accent: "#3DB8F5",
    tags: ["AWS Lambda", "GCP Vertex", "Terraform"],
    icon: "◇",
  },
  {
    id: "04",
    label: "Intelligence Layer",
    title: "Operational Intelligence",
    desc: "Every decision, exception, and service health signal is visible, measurable, and ready for improvement.",
    accent: "#34D399",
    tags: ["Monitoring", "Alerts", "Dashboards"],
    icon: "○",
  },
];

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Header reveal
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".cap-header"),
      { opacity: 0, y: 24, filter: "blur(4px)" },
      {
        opacity: 1, y: 0, filter: "blur(0px)",
        duration: 1.0, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
      }
    );

    // Cards stagger in with depth
    const cards = sectionRef.current.querySelectorAll(".cap-card");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40, filter: "blur(3px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.9, delay: i * 0.12, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 55%" },
        }
      );
    });

    // Signal lines draw in
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".signal-line"),
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1, opacity: 1,
        duration: 1.4, stagger: 0.15, ease: "power2.inOut",
        scrollTrigger: { trigger: sectionRef.current, start: "top 50%" },
      }
    );

    // Animated flow pulse on the central spine
    gsap.to(sectionRef.current.querySelectorAll(".flow-pulse"), {
      y: "100%",
      duration: 2.5,
      ease: "none",
      repeat: -1,
      stagger: 0.8,
    });
  }, []);

  return (
    <section id="infrastructure" ref={sectionRef} className="section relative">
      {/* Atmospheric section glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(91,142,240,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-9 md:mb-10">
          <div className="lg:col-span-6 cap-header">
            <div className="t-label tracking-widest uppercase opacity-70 mb-5">System Architecture</div>
            <h2 className="t-h2 text-balance font-serif" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              One operating layer<br />for AI execution.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 flex items-end cap-header">
            <p className="t-body opacity-80" style={{ fontSize: "1.05rem" }}>
              Four practical layers connect intake, reasoning, execution, and monitoring into one production system.
            </p>
          </div>
        </div>

        {/* ── SPATIAL LAYER STACK ────────────────────────────────── */}
        <div className="relative flex flex-col gap-0">

          {/* Central vertical spine */}
          <div className="absolute left-[60px] lg:left-[80px] top-0 bottom-0 w-px bg-white/[0.06] z-0 overflow-hidden">
            {/* Animated flow pulses traveling down */}
            <div className="flow-pulse absolute top-[-20%] left-0 w-full h-[20%] bg-gradient-to-b from-transparent via-[#5B8EF0] to-transparent opacity-60" />
            <div className="flow-pulse absolute top-[-20%] left-0 w-full h-[20%] bg-gradient-to-b from-transparent via-[#8B6CF0] to-transparent opacity-40" />
          </div>

          {LAYERS.map((layer, i) => (
            <div
              key={layer.id}
              className="cap-card relative grid grid-cols-1 lg:grid-cols-12 gap-6 pb-5 pt-5"
              style={{ willChange: "transform" }}
            >
              {/* Left: node + connector */}
              <div className="lg:col-span-1 flex flex-col items-center pt-1">
                {/* Node circle on spine */}
                <div
                  className="relative z-10 w-[18px] h-[18px] rounded-full border-2 flex-shrink-0"
                  style={{
                    background: "#030408",
                    borderColor: layer.accent,
                    boxShadow: `0 0 12px ${layer.accent}60`,
                    marginLeft: "1px",
                  }}
                >
                  <div
                    className="absolute inset-[3px] rounded-full"
                    style={{ background: layer.accent, opacity: 0.8 }}
                  />
                </div>
                {/* Connector tick to content */}
                <div
                  className="signal-line flex-1 mt-2 w-px origin-top"
                  style={{
                    background: `linear-gradient(to bottom, ${layer.accent}40, transparent)`,
                    minHeight: "60px",
                  }}
                />
              </div>

              {/* Right: layer content card */}
              <div className="lg:col-span-11">
                {/* Signal line from node to card */}
                <div className="hidden lg:block absolute left-[68px] lg:left-[88px] top-[30px] h-px w-12 signal-line origin-left"
                  style={{ background: `linear-gradient(to right, ${layer.accent}60, transparent)` }}
                />

                <div
                  className="relative backdrop-blur-sm rounded-2xl p-8 border transition-all duration-500 hover:border-white/10"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)`,
                    border: `1px solid rgba(255,255,255,0.05)`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${layer.accent}12`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {/* Card top row */}
                  <div className="flex items-start justify-between mb-5 gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl opacity-60" style={{ color: layer.accent }}>
                        {layer.id}
                      </span>
                      <div>
                        <div className="t-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: layer.accent }}>
                          {layer.id} / {layer.label}
                        </div>
                        <h3 className="font-serif font-medium" style={{ fontSize: "1.3rem", color: "#EEF2F8" }}>
                          {layer.title}
                        </h3>
                      </div>
                    </div>

                    {/* Routing indicator */}
                    <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: layer.accent }} />
                      <span className="t-mono text-[9px] uppercase tracking-widest" style={{ color: layer.accent, opacity: 0.7 }}>
                        ACTIVE
                      </span>
                    </div>
                  </div>

                  <p className="t-body opacity-60 mb-6" style={{ fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "56ch" }}>
                    {layer.desc}
                  </p>

                  {/* Tags + signal path to next */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {layer.tags.map((tag) => (
                      <span
                        key={tag}
                        className="t-mono px-3 py-1.5 rounded-md text-white/50"
                        style={{
                          fontSize: "11px",
                          background: `${layer.accent}08`,
                          border: `1px solid ${layer.accent}20`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {i < LAYERS.length - 1 && (
                      <div className="ml-auto t-mono text-[9px] opacity-30 uppercase tracking-widest flex items-center gap-1">
                        routes to {LAYERS[i + 1].label}
                        <span className="text-base" style={{ color: LAYERS[i+1].accent, opacity: 0.5 }}>↓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
