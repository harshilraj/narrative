"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    week: "WK 1",
    phase: "DISCOVERY",
    title: "System Audit",
    points: ["Map existing data flows", "Identify automation gaps"],
  },
  {
    num: "02",
    week: "WK 2",
    phase: "ARCHITECTURE",
    title: "Blueprint",
    points: ["Design AI layer structure", "Select models + connectors"],
  },
  {
    num: "03",
    week: "WK 3-4",
    phase: "BUILD",
    title: "Integration",
    points: ["Connect pipelines live", "Wire decision routing"],
  },
  {
    num: "04",
    week: "WK 5",
    phase: "VALIDATION",
    title: "Testing",
    points: ["Load + edge case testing", "Performance tuning"],
  },
  {
    num: "05",
    week: "WK 6",
    phase: "LAUNCH",
    title: "Production",
    points: ["Monitoring activated", "Full handoff complete"],
  },
];

export default function Process() {
  const [entered, setEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setEntered(true);
    }, { threshold: 0.35 });
    observer.observe(sectionRef.current);

    gsap.fromTo(
      sectionRef.current.querySelectorAll(".deployment-reveal"),
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

    return () => observer.disconnect();
  }, []);

  return (
    <section id="results" ref={sectionRef} className="section deployment-shell">
      <div className="container relative z-10">
        <div className="deployment-reveal max-w-3xl">
          <div className="section-eyebrow mb-4">DEPLOYMENT SEQUENCE</div>
          <h2 className="section-title">Audit to production.</h2>
          <p className="t-body mt-4">Six weeks. No surprises.</p>
        </div>

        <div className={`deployment-reveal deployment-rail ${entered ? "is-entered" : ""}`}>
          <div className="deployment-fill" />
          {STEPS.map((step) => (
            <article key={step.num} className="deployment-step">
              <div className="deployment-node">{step.num}</div>
              <div className="deployment-connector" />
              <div className="deployment-card">
                <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--accent)]">{step.week}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">{step.phase}</div>
                <h3 className="mt-2 font-serif text-[18px] leading-none text-white">{step.title}</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {step.points.map((point) => (
                    <li key={point} className="font-mono text-[10px] leading-relaxed text-white/55">
                      <span className="text-[var(--accent)]">-</span> {point}
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
