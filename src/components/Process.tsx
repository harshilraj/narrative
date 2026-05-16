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
        <div className="deploy-reveal deployment-experience" aria-label="Operational deployment system">
          <div className="deployment-narrative">
            <div className="section-eyebrow mb-4">OPERATIONAL DEPLOYMENT</div>
            <h2 className="section-title text-balance">AI infrastructure activating across the work itself.</h2>
            <p className="t-body mt-5">Narrative deploys intelligence into the systems teams already run, then keeps every autonomous action governed, observable, and ready to improve.</p>

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

            <div className="deployment-proofbar deployment-proofbar-refined">
              <span>Workflows preserved</span>
              <span>Systems connected</span>
              <span>Autonomy governed</span>
              <span>Audit always visible</span>
            </div>
          </div>

          <div className="deployment-journey" aria-label="Deployment journey">
            <div className="deployment-atmosphere" aria-hidden="true" />
            <div className="deployment-rail" aria-hidden="true">
              <svg viewBox="0 0 420 760" preserveAspectRatio="none">
                <path className="deployment-route-base" d="M210 380 L86 118" />
                <path className="deployment-route-base" d="M210 380 L332 160" />
                <path className="deployment-route-base" d="M210 380 L88 388" />
                <path className="deployment-route-base" d="M210 380 L335 430" />
                <path className="deployment-route-base" d="M210 380 L210 650" />
                <path className="deployment-route-flow" d="M86 118 C128 188 168 288 210 380 C254 474 232 570 210 650" />
              </svg>
            </div>

            <div className="deployment-system-core" aria-hidden="true">
              <span>Execution Layer</span>
              <strong>System Active</strong>
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
          </div>
        </div>
      </div>
    </section>
  );
}
