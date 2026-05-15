"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ARCHITECTURE = [
  {
    id: "01",
    label: "DATA LAYER",
    title: "Signal Intake",
    items: ["Event Streams", "API Gateway", "Data Connectors", "Schema Normalization", "Queue Control"],
  },
  {
    id: "02",
    label: "INTELLIGENCE",
    title: "Decision Core",
    items: ["Model Router", "Context Store", "Decision Graph", "Policy Rules", "Confidence Scoring"],
  },
  {
    id: "03",
    label: "EXECUTION",
    title: "Action Layer",
    items: ["Action Engine", "Audit Log", "Integrations", "Rollback Paths", "Human Review"],
  },
];

function FlowArrow() {
  return (
    <div className="architecture-arrow" aria-hidden="true">
      <svg viewBox="0 0 150 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12H136" stroke="rgba(0,255,178,0.38)" strokeWidth="1" strokeDasharray="5 8" />
        <path d="M126 5L138 12L126 19" stroke="rgba(0,255,178,0.48)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle className="architecture-pulse" cx="8" cy="12" r="3" fill="#00FFB2" />
      </svg>
    </div>
  );
}

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const elements = sectionRef.current.querySelectorAll(".architecture-reveal");
    gsap.fromTo(
      elements,
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
    <section id="infrastructure" ref={sectionRef} className="section relative overflow-hidden">
      <div className="container relative z-10">
        <div className="architecture-reveal mx-auto mb-9 max-w-3xl text-center">
          <div className="t-label mb-3">03 / SYSTEM ARCHITECTURE</div>
          <h2 className="font-serif text-white" style={{ fontSize: "42px", lineHeight: 1.06 }}>
            One operating layer for AI execution.
          </h2>
          <p className="mt-2 font-mono text-[13px] tracking-[0.08em] text-white/50">
            Signal → Intelligence → Execution, unified.
          </p>
        </div>

        <div className="architecture-reveal architecture-flow">
          {ARCHITECTURE.map((layer, index) => (
            <div key={layer.id} className="architecture-stage">
              <article className="architecture-card">
                <div className="mb-7 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.16em] text-[#00FFB2]">{layer.id}</span>
                    <div className="mt-3 font-mono text-[11px] tracking-[0.15em] text-[#00ffb2cc]">{layer.label}</div>
                    <h3 className="mt-3 font-serif text-[22px] leading-tight text-white">{layer.title}</h3>
                  </div>
                  <span className="active-badge">ACTIVE</span>
                </div>

                <ul className="flex flex-col gap-4">
                  {layer.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-white/65">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00FFB2]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
              {index < ARCHITECTURE.length - 1 && <FlowArrow />}
            </div>
          ))}
        </div>

        <p className="architecture-reveal mt-8 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-white/30">
          All layers observable. All decisions logged. All actions reversible.
        </p>
      </div>
    </section>
  );
}
