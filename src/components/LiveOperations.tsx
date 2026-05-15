"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const FLOW = [
  {
    label: "Signals",
    title: "Operational intake",
    copy: "Workflows, events, approvals, and cloud activity enter a single execution fabric.",
    meta: ["APIs", "Events", "Systems"],
  },
  {
    label: "Intelligence",
    title: "Context reasoning",
    copy: "Models evaluate policies, history, business logic, and risk before action is triggered.",
    meta: ["Policy", "Memory", "Review"],
  },
  {
    label: "Execution",
    title: "Automated action",
    copy: "Approved decisions move across CRMs, internal systems, cloud services, and teams.",
    meta: ["Routing", "Actions", "Rollback"],
  },
  {
    label: "Monitoring",
    title: "Operational control",
    copy: "Every action stays observable with audit trails, reliability signals, and human override.",
    meta: ["Logs", "SLO", "Oversight"],
  },
];

export default function LiveOperations() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".flow-reveal"),
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
    <section id="process" ref={sectionRef} className="section operational-flow-section relative overflow-hidden">
      <div className="container relative z-10">
        <div className="flow-reveal mb-12 max-w-3xl">
          <div className="section-eyebrow mb-4">HOW IT&apos;S BUILT</div>
          <h2 className="section-title text-balance">Operations flowing through intelligent infrastructure.</h2>
          <p className="t-body mt-5">Narrative turns fragmented work into a connected execution loop: signals become context, context becomes action, and every action remains observable.</p>
        </div>

        <div className="flow-reveal orchestration-flow" aria-label="Operational build flow">
          <div className="flow-backplane" aria-hidden="true">
            <div className="flow-line" />
            <div className="flow-pulse-runner" />
          </div>

          {FLOW.map((stage, index) => (
            <article key={stage.label} className="flow-stage">
              <div className="flow-node">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="flow-stage-content">
                <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--accent)]">{stage.label}</div>
                <h3>{stage.title}</h3>
                <p className="t-body mt-4">{stage.copy}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {stage.meta.map((item) => (
                    <span key={item} className="tag-chip">{item}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flow-reveal infra-ribbon mt-10">
          <span>Cloud-native execution</span>
          <strong>AWS</strong>
          <strong>Google Cloud</strong>
          <strong>Azure</strong>
          <strong>Secure deployment</strong>
          <strong>Human oversight</strong>
        </div>
      </div>
    </section>
  );
}
