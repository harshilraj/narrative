"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const SHOWCASES = [
  {
    industry: "Financial Services",
    title: "Regulatory compliance router",
    description: "Flags exceptions before review queues slow down.",
    metrics: ["0.82s - Document latency", "10k/day - Review throughput", "94% - Manual routing reduction"],
    tags: ["RAG", "Kafka", "AWS"],
  },
  {
    industry: "Supply Chain",
    title: "Freight exception engine",
    description: "Resolves carrier alerts across fragmented systems.",
    metrics: ["12s - Average resolution", "82% - Auto-routed alerts", "1 trail - ERP, TMS, WMS"],
    tags: ["Vertex AI", "Pub/Sub", "GCP"],
  },
  {
    industry: "Operations",
    title: "Work intake classifier",
    description: "Routes requests with context and ownership.",
    metrics: ["63% - Faster triage", "14 - Workspaces synced", "99.9% - Routing uptime"],
    tags: ["LLM Router", "API", "Queues"],
  },
  {
    industry: "Infrastructure",
    title: "Production health layer",
    description: "Surfaces service risk before teams feel it.",
    metrics: ["47 - Services monitored", "3 - Regions covered", "24/7 - Alert coverage"],
    tags: ["Monitoring", "Logs", "Cloud"],
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
      <path d={`M ${nodes[0].x} ${nodes[0].y} L ${nodes[1].x} ${nodes[1].y} L ${nodes[2].x} ${nodes[2].y} L ${nodes[3].x} ${nodes[3].y}`} stroke="rgba(0,255,178,0.45)" strokeWidth="1" strokeDasharray="4 5" />
      {nodes.map((node, nodeIndex) => (
        <circle
          key={`${index}-${nodeIndex}`}
          cx={node.x}
          cy={node.y}
          r={nodeIndex === index % nodes.length ? 4 : 2.5}
          fill={nodeIndex === index % nodes.length ? "#00FFB2" : "rgba(255,255,255,0.55)"}
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
    <section id="case-studies" ref={sectionRef} className="section relative overflow-hidden py-20">
      <div className="container relative z-10">
        <div className="showcase-reveal mx-auto mb-10 max-w-3xl text-center">
          <div className="t-label mb-3">System Showcases</div>
          <h2 className="font-serif text-white" style={{ fontSize: "42px", lineHeight: 1.06 }}>
            Production systems, not prototype theater.
          </h2>
        </div>

        <div className="showcase-grid">
          {SHOWCASES.map((showcase, index) => (
            <article key={showcase.title} className="showcase-card showcase-reveal">
              <div className="mb-5 flex items-start justify-between gap-5">
                <div>
                  <div className="t-label mb-3 opacity-70">{showcase.industry}</div>
                  <h3 className="font-serif text-[24px] leading-tight text-white">{showcase.title}</h3>
                  <p className="mt-3 font-mono text-[11px] leading-relaxed tracking-[0.03em] text-white/55">{showcase.description}</p>
                </div>
                <MiniDiagram index={index} />
              </div>

              <div className="grid grid-cols-1 gap-2">
                {showcase.metrics.map((metric) => (
                  <div key={metric} className="font-mono text-[11px] tracking-[0.04em] text-white/70">
                    <span className="text-[#00FFB2]">{metric.split(" - ")[0]}</span>
                    <span className="text-white/35"> - </span>
                    <span>{metric.split(" - ")[1]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {showcase.tags.map((tag) => (
                  <span key={tag} className="tag-chip font-mono">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
