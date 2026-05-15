"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const SHOWCASES = [
  {
    industry: "Financial Services",
    title: "Compliance routing at scale",
    description: "Regulatory documents move from intake to decision without manual triage.",
    metrics: ["0.82s - Document latency", "94% - Manual routing reduction"],
    tags: ["RAG", "Kafka", "AWS"],
  },
  {
    industry: "Supply Chain",
    title: "Freight exceptions resolved",
    description: "Carrier alerts route automatically across warehouse and transport systems.",
    metrics: ["12s - Average resolution", "82% - Auto-routed alerts"],
    tags: ["Vertex AI", "Pub/Sub", "GCP"],
  },
  {
    industry: "Operations",
    title: "Intake without bottlenecks",
    description: "Requests arrive with owner, context, and next action already assigned.",
    metrics: ["63% - Faster triage", "14 - Workspaces synced"],
    tags: ["Router", "API", "Queues"],
  },
  {
    industry: "Infrastructure",
    title: "Health before incidents",
    description: "Service risk surfaces before latency becomes an operational problem.",
    metrics: ["47 - Services monitored", "3 - Regions covered"],
    tags: ["Logs", "SLO", "Cloud"],
  },
];

function MiniDiagram({ index }: { index: number }) {
  const nodes = [
    { x: 22, y: 50 },
    { x: 42, y: 30 },
    { x: 62, y: 48 },
    { x: 78, y: 24 },
  ];

  return (
    <svg viewBox="0 0 100 70" className="h-16 w-24 flex-shrink-0" fill="none" aria-hidden="true">
      <path d={`M ${nodes[0].x} ${nodes[0].y} L ${nodes[1].x} ${nodes[1].y} L ${nodes[2].x} ${nodes[2].y} L ${nodes[3].x} ${nodes[3].y}`} stroke="rgba(139,127,255,0.45)" strokeWidth="1" strokeDasharray="4 5" />
      {nodes.map((node, nodeIndex) => (
        <circle
          key={`${index}-${nodeIndex}`}
          cx={node.x}
          cy={node.y}
          r={nodeIndex === index % nodes.length ? 4 : 2.5}
          fill={nodeIndex === index % nodes.length ? "#8B7FFF" : "rgba(255,255,255,0.55)"}
        />
      ))}
      <circle cx="50" cy="36" r="28" stroke="rgba(255,255,255,0.06)" />
    </svg>
  );
}

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".showcase-reveal"),
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
    <section id="case-studies" ref={sectionRef} className="section relative overflow-hidden">
      <div className="container relative z-10">
        <div className="showcase-reveal mb-10 max-w-3xl">
          <div className="section-eyebrow mb-4">RESULTS</div>
          <h2 className="section-title text-balance">Real deployments. Measurable outcomes.</h2>
        </div>

        <div className="showcase-grid">
          {SHOWCASES.map((showcase, index) => (
            <article key={showcase.title} className="showcase-card showcase-reveal">
              <div className="mb-6 flex items-start justify-between gap-5">
                <div>
                  <div className="section-eyebrow mb-3 text-[9px] opacity-70">{showcase.industry}</div>
                  <h3 className="font-serif text-[26px] leading-none text-white">{showcase.title}</h3>
                  <p className="mt-4 font-mono text-[12px] leading-relaxed tracking-[0.03em] text-white/55">{showcase.description}</p>
                </div>
                <MiniDiagram index={index} />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {showcase.metrics.map((metric) => (
                  <div key={metric} className="font-mono text-[11px] tracking-[0.04em] text-white/70">
                    <span className="text-[var(--accent-bright)]">{metric.split(" - ")[0]}</span>
                    <span className="text-white/35"> - </span>
                    <span>{metric.split(" - ")[1]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {showcase.tags.map((tag) => (
                  <span key={tag} className="tag-chip">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
