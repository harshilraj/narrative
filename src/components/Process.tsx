"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const STACK = [
  {
    id: "01",
    label: "SYSTEMS AUDIT",
    title: "Operational reality map",
    copy: "Map workflows, repetitive operations, bottlenecks, cloud infrastructure, and data movement.",
  },
  {
    id: "02",
    label: "ORCHESTRATION BLUEPRINT",
    title: "Execution architecture",
    copy: "Design the AI execution layer, routing logic, integrations, and automation architecture.",
  },
  {
    id: "03",
    label: "AI + CLOUD INTEGRATION",
    title: "Production connection",
    copy: "Connect models, APIs, CRMs, internal systems, and cloud services into one operational layer.",
  },
  {
    id: "04",
    label: "AUTONOMOUS EXECUTION",
    title: "Live operational action",
    copy: "Deploy AI workflows that trigger, route, decide, and execute automatically.",
  },
  {
    id: "05",
    label: "MONITORING + OPTIMIZATION",
    title: "Continuous reliability",
    copy: "Track performance, reliability, latency, audit logs, and operational efficiency continuously.",
  },
];

const TRUST = [
  "Up to 90% repetitive work reduction",
  "Enterprise-ready deployment",
  "Cloud-native architecture",
  "Human-in-the-loop safeguards",
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".transformation-reveal"),
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
    <section id="results" ref={sectionRef} className="section relative overflow-hidden">
      <div className="container relative z-10">
        <div className="transformation-reveal max-w-3xl">
          <div className="section-eyebrow mb-4">DEPLOYMENT SEQUENCE</div>
          <h2 className="section-title text-balance">From operational chaos to autonomous execution.</h2>
          <p className="t-body mt-5">We design, integrate, and deploy AI systems directly into real business operations - without disrupting existing workflows.</p>
        </div>

        <div className="transformation-reveal transformation-stack mt-12">
          {STACK.map((step) => (
            <article key={step.id} className="transformation-row">
              <div className="transformation-index">{step.id}</div>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--accent)]">{step.label}</div>
                <h3 className="mt-2 font-serif text-[26px] leading-none text-white">{step.title}</h3>
              </div>
              <p className="t-body max-w-xl">{step.copy}</p>
            </article>
          ))}
        </div>

        <div className="transformation-reveal metrics-bar mt-8">
          {TRUST.map((item) => (
            <div key={item} className="metrics-item">{item}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
