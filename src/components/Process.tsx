"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  {
    id: "01",
    label: "Operational Mapping",
    state: "DISCOVER",
    copy: "Analyze workflows, bottlenecks, approvals, systems, and cloud infrastructure.",
  },
  {
    id: "02",
    label: "Intelligence Architecture",
    state: "DESIGN",
    copy: "Design orchestration logic, AI routing, memory systems, and execution layers.",
  },
  {
    id: "03",
    label: "Systems Integration",
    state: "CONNECT",
    copy: "Connect APIs, CRMs, cloud environments, data pipelines, and operational tooling.",
  },
  {
    id: "04",
    label: "Autonomous Execution",
    state: "EXECUTE",
    copy: "Deploy AI-powered workflows capable of routing, triggering, and executing decisions automatically.",
  },
  {
    id: "05",
    label: "Monitoring + Optimization",
    state: "OBSERVE",
    copy: "Track reliability, audit visibility, latency, system health, and operational efficiency continuously.",
  },
];

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
        <div className="deploy-reveal max-w-3xl">
          <div className="section-eyebrow mb-4">OPERATIONAL DEPLOYMENT</div>
          <h2 className="section-title text-balance">Deploy AI systems directly into operational reality.</h2>
          <p className="t-body mt-5">Narrative AI integrates directly into existing workflows, cloud systems, and operational pipelines - transforming repetitive coordination into intelligent execution layers.</p>
        </div>

        <div className="deploy-reveal deployment-command" aria-label="Deployment pipeline">
          <div className="deployment-status-panel" aria-hidden="true">
            <div>
              <span>deployment state</span>
              <strong>controlled rollout</strong>
            </div>
            <div>
              <span>governance</span>
              <strong>audit ready</strong>
            </div>
            <div className="deployment-live-indicator">
              <span className="pulse-dot" />
              signal stable
            </div>
          </div>

          {PHASES.map((phase, index) => (
            <article key={phase.id} className={`command-node command-node-${index + 1}`}>
              <div className="command-connector" aria-hidden="true">
                <span />
              </div>
              <div className="command-node-head">
                <span>{phase.id}</span>
                <strong>{phase.state}</strong>
              </div>
              <h3>{phase.label}</h3>
              <p>{phase.copy}</p>
            </article>
          ))}
        </div>

        <div className="deploy-reveal deployment-proofbar">
          <span>Existing workflows preserved</span>
          <span>Cloud systems connected</span>
          <span>Autonomous execution controlled</span>
          <span>Audit visibility retained</span>
        </div>
      </div>
    </section>
  );
}
