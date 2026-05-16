"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  {
    id: "01",
    title: "Operational Mapping",
    copy: "Analyze workflows, approvals, bottlenecks, systems, and operational dependencies.",
  },
  {
    id: "02",
    title: "Intelligence Design",
    copy: "Define orchestration logic, routing behavior, memory systems, and execution policies.",
  },
  {
    id: "03",
    title: "Infrastructure Integration",
    copy: "Connect APIs, cloud systems, internal tooling, and operational data flows.",
  },
  {
    id: "04",
    title: "Autonomous Execution",
    copy: "Deploy AI-powered workflows capable of controlled decision routing and automated execution.",
  },
  {
    id: "05",
    title: "Continuous Optimization",
    copy: "Monitor reliability, audit visibility, operational latency, and execution quality continuously.",
  },
];

const SIGNALS = ["governed rollout", "audit visible", "systems stable"];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".deploy-reveal"),
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
    <section id="results" ref={sectionRef} className="section deployment-command-section relative overflow-hidden">
      <div className="container relative z-10">
        <div className="deploy-reveal deployment-experience" aria-label="Operational deployment system">
          <div className="deployment-narrative">
            <div className="section-eyebrow mb-4">OPERATIONAL DEPLOYMENT</div>
            <h2 className="section-title text-balance">Deployment that enters the business quietly.</h2>
            <p className="t-body mt-5">Narrative moves from operational analysis to controlled autonomous execution without turning production systems into experiments.</p>

            <aside className="deployment-core" aria-label="Live deployment state">
              <div className="deployment-core-status">
                <span className="pulse-dot" />
                deployment state
              </div>
              <h3>Production-ready. Observable. Governed from day one.</h3>
              <div className="deployment-core-signals">
                {SIGNALS.map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>
            </aside>

            <div className="deployment-proofbar deployment-proofbar-refined">
              <span>Workflows preserved</span>
              <span>Systems connected</span>
              <span>Autonomy governed</span>
              <span>Audit always visible</span>
            </div>
          </div>

          <div className="deployment-sequence" aria-label="Deployment sequence">
            {PHASES.map((phase) => (
              <article key={phase.id} className="deployment-step">
                <div className="deployment-step-index">{phase.id}</div>
                <div className="deployment-step-copy">
                  <h3>{phase.title}</h3>
                  <p>{phase.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
