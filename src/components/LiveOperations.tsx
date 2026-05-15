"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  {
    id: "01",
    label: "DATA LAYER",
    title: "Unified signal intake",
    description: "Every operational input lands in one normalized stream before models or humans act.",
    tags: ["Streams", "Webhooks", "Sync"],
    metrics: ["2.4M events/day", "42 sources", "99.9% intake"],
  },
  {
    id: "02",
    label: "MODEL LAYER",
    title: "Reasoning with context",
    description: "Routing logic selects the right model, memory, and policy for every decision path.",
    tags: ["Router", "Memory", "Policy"],
    metrics: ["340ms avg", "18 models", "0 drift"],
  },
  {
    id: "03",
    label: "ACTION LAYER",
    title: "Automated execution",
    description: "Approved decisions trigger workflows, integrations, audits, and rollback guards.",
    tags: ["Triggers", "Bus", "Audit"],
    metrics: ["99.97% uptime", "128 flows", "24/7 logs"],
  },
  {
    id: "04",
    label: "CONTROL LAYER",
    title: "Production observability",
    description: "Teams see every decision, exception, latency spike, and handoff before risk compounds.",
    tags: ["Logs", "Alerts", "SLO"],
    metrics: ["47 services", "3 regions", "1 control view"],
  },
];

export default function LiveOperations() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".layer-reveal"),
      { opacity: 0, y: 24, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
      }
    );
  }, []);

  return (
    <section id="process" ref={sectionRef} className="section relative overflow-hidden">
      <div className="container relative z-10">
        <div className="layer-reveal mb-12 max-w-3xl">
          <div className="section-eyebrow mb-4">HOW IT&apos;S BUILT</div>
          <h2 className="section-title text-balance">Every layer engineered for production.</h2>
          <p className="t-body mt-5">Not demos. Not prototypes. Systems that run.</p>
        </div>

        <div className="layer-reveal layer-stack">
          {LAYERS.map((layer) => (
            <article key={layer.id} className="layer-row">
              <div className="layer-number">{layer.id}</div>

              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--accent)]">{layer.id} / {layer.label}</div>
                    <h3 className="mt-2 font-serif text-[28px] leading-none text-white">{layer.title}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {layer.tags.map((tag) => (
                      <span key={tag} className="tag-chip">{tag}</span>
                    ))}
                    <span className="active-badge">
                      <span className="pulse-dot" />
                      ACTIVE
                    </span>
                  </div>
                </div>

                <div className="layer-details">
                  <p className="t-body max-w-2xl">{layer.description}</p>
                  <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                    {layer.metrics.map((metric) => (
                      <div key={metric} className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
                        <span className="text-[var(--accent-bright)]">{metric.split(" ")[0]}</span>{" "}
                        {metric.split(" ").slice(1).join(" ")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
