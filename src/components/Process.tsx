"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    phase: "AUDIT",
    title: "Current State",
    duration: "Week 1",
    points: ["Map data flows", "Identify gaps"],
  },
  {
    num: "02",
    phase: "DESIGN",
    title: "System Blueprint",
    duration: "Week 2",
    points: ["Architecture plan", "Model selection"],
  },
  {
    num: "03",
    phase: "BUILD",
    title: "Core Integration",
    duration: "Week 3-4",
    points: ["Pipelines live", "Connectors live"],
  },
  {
    num: "04",
    phase: "TEST",
    title: "Validation Loop",
    duration: "Week 5",
    points: ["Load test", "Tune edge cases"],
  },
  {
    num: "05",
    phase: "DEPLOY",
    title: "Production",
    duration: "Week 6",
    points: ["Monitoring live", "Handoff complete"],
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".timeline-reveal"),
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
        <div className="timeline-reveal mx-auto mb-12 max-w-3xl text-center">
          <div className="t-label mb-3">04 / DEPLOYMENT SEQUENCE</div>
          <h2 className="font-serif text-white" style={{ fontSize: "42px", lineHeight: 1.06 }}>
            Audit to production.
          </h2>
          <p className="mt-2 font-mono text-[13px] tracking-[0.08em] text-white/40">Typically 3-6 weeks.</p>
        </div>

        <div className="timeline-reveal deployment-timeline">
          <div className="timeline-track" />
          <div className="timeline-fill" />

          {STEPS.map((step) => (
            <article key={step.num} className="timeline-step">
              <div className="timeline-node">{step.num}</div>
              <div className="timeline-card">
                <div className="font-mono text-[10px] tracking-[0.1em] text-[#00FFB2]">{step.num} / {step.phase}</div>
                <h3 className="mt-2 font-serif text-[16px] leading-tight text-white">{step.title}</h3>
                <div className="mt-2 font-mono text-[10px] tracking-[0.08em] text-white/40">{step.duration}</div>
                <ul className="mt-4 flex flex-col gap-2">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 font-mono text-[9px] tracking-[0.04em] text-white/55">
                      <span className="h-1 w-1 rounded-full bg-[#00FFB2]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
