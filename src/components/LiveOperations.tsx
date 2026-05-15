"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  {
    id: "01",
    label: "DATA LAYER",
    title: "Unified operational intake",
    description: "Every workflow, API, event stream, and business signal enters one normalized orchestration layer before actions are triggered.",
    tags: ["APIs", "Events", "Systems"],
    metrics: ["AWS ready", "GCP ready", "Azure ready"],
  },
  {
    id: "02",
    label: "MODEL LAYER",
    title: "Context-aware reasoning",
    description: "Models evaluate operational context, memory, policies, and business logic before decisions execute.",
    tags: ["Policy", "Memory", "Review"],
    metrics: ["Traceable", "Governed", "Observable"],
  },
  {
    id: "03",
    label: "ACTION LAYER",
    title: "Automated execution systems",
    description: "Actions route instantly across CRMs, internal systems, cloud services, and operational tools.",
    tags: ["CRM", "Cloud", "Internal"],
    metrics: ["Reversible", "Audited", "Controlled"],
  },
  {
    id: "04",
    label: "CLOUD LAYER",
    title: "Secure cloud deployment",
    description: "Systems are deployed into scalable cloud environments with observability, access control, and operational safeguards.",
    tags: ["AWS", "GCP", "Azure"],
    metrics: ["Kubernetes", "Serverless", "Secure infra"],
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
          <h2 className="section-title text-balance">Infrastructure designed for autonomous operations.</h2>
          <p className="t-body mt-5">Production-grade AI systems built to integrate with existing workflows, cloud infrastructure, and operational pipelines.</p>
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

        <div className="layer-reveal mt-8 cloud-strip">
          <span>Cloud-native deployment</span>
          <strong>AWS</strong>
          <strong>Google Cloud</strong>
          <strong>Azure</strong>
          <strong>Kubernetes</strong>
          <strong>Serverless</strong>
          <strong>Secure Infrastructure</strong>
        </div>
      </div>
    </section>
  );
}
