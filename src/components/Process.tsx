"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  {
    id: "01",
    label: "Discover",
    title: "Map the operating surface",
    copy: "Workflows, dependencies, policies, and failure points become one deployment graph.",
    metric: "Signal baseline",
  },
  {
    id: "02",
    label: "Design",
    title: "Shape the intelligence layer",
    copy: "Routing logic, model boundaries, review paths, and memory are engineered before rollout.",
    metric: "Policy aligned",
  },
  {
    id: "03",
    label: "Connect",
    title: "Bind into live systems",
    copy: "APIs, cloud services, CRMs, data pipelines, and teams connect without replacing the business.",
    metric: "Systems linked",
  },
  {
    id: "04",
    label: "Execute",
    title: "Activate controlled autonomy",
    copy: "Approved workflows begin routing decisions, triggering actions, and escalating exceptions.",
    metric: "Execution live",
  },
  {
    id: "05",
    label: "Optimize",
    title: "Continuously tune operations",
    copy: "Reliability, latency, audit trails, and operational gains are monitored as the system evolves.",
    metric: "Feedback loop",
  },
];

const SIGNALS = ["workflow intake", "policy memory", "cloud routing", "audit surface"];

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
        <div className="deploy-reveal deployment-heading">
          <div className="section-eyebrow mb-4">OPERATIONAL DEPLOYMENT</div>
          <h2 className="section-title text-balance">AI infrastructure activating across the work itself.</h2>
          <p className="t-body mt-5">Narrative deploys intelligence into the systems teams already run, then keeps every autonomous action governed, observable, and ready to improve.</p>
        </div>

        <div className="deploy-reveal deployment-journey" aria-label="Deployment journey">
          <div className="deployment-atmosphere" aria-hidden="true" />
          <div className="deployment-rail" aria-hidden="true">
            <svg viewBox="0 0 1000 360" preserveAspectRatio="none">
              <path className="deployment-route-base" d="M36 254 C180 76 312 318 450 170 C578 34 672 244 798 142 C884 74 930 104 964 78" />
              <path className="deployment-route-flow" d="M36 254 C180 76 312 318 450 170 C578 34 672 244 798 142 C884 74 930 104 964 78" />
            </svg>
          </div>

          {PHASES.map((phase, index) => (
            <article key={phase.id} className={`deployment-stage deployment-stage-${index + 1}`}>
              <div className="deployment-stage-marker" aria-hidden="true">
                <span>{phase.id}</span>
              </div>
              <div className="deployment-stage-copy">
                <div className="deployment-stage-label">{phase.label}</div>
                <h3>{phase.title}</h3>
                <p>{phase.copy}</p>
                <strong>{phase.metric}</strong>
              </div>
            </article>
          ))}

          <aside className="deployment-core" aria-label="Live deployment state">
            <div className="deployment-core-status">
              <span className="pulse-dot" />
              operational layer initialized
            </div>
            <h3>Controlled autonomy, live in production.</h3>
            <div className="deployment-core-signals">
              {SIGNALS.map((signal) => (
                <span key={signal}>{signal}</span>
              ))}
            </div>
          </aside>
        </div>

        <div className="deploy-reveal deployment-proofbar deployment-proofbar-refined">
          <span>Workflows preserved</span>
          <span>Systems connected</span>
          <span>Autonomy governed</span>
          <span>Audit always visible</span>
        </div>
      </div>
    </section>
  );
}
