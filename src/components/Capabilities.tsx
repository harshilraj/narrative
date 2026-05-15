"use client";
import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    label: "01 / SIGNAL LAYER",
    status: "INGESTING",
    title: "Operational Signals",
    items: ["Business Activity", "Workflow Events", "Cloud Systems", "Approval Queues"],
    stat: "UNIFIED",
    statLabel: "intake across systems",
  },
  {
    label: "02 / INTELLIGENCE LAYER",
    status: "REASONING",
    title: "Decision Intelligence",
    items: ["Context Routing", "Policy Logic", "Human Review", "Model Selection"],
    stat: "GOVERNED",
    statLabel: "reasoning before action",
  },
  {
    label: "03 / EXECUTION LAYER",
    status: "EXECUTING",
    title: "Autonomous Execution",
    items: ["Workflow Dispatch", "System Updates", "Audit Trails", "Rollback Guards"],
    stat: "DEPLOYED",
    statLabel: "inside production operations",
  },
];

function Divider() {
  return (
    <div className="architecture-divider" aria-hidden="true">
      <div className="flow-orb">
        <span className="font-mono text-[18px]">→</span>
      </div>
    </div>
  );
}

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".architecture-reveal"),
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
    <section id="infrastructure" ref={sectionRef} className="section architecture-shell">
      <div className="container relative z-10">
        <div className="architecture-reveal">
          <div className="section-eyebrow mb-4">SYSTEM ARCHITECTURE</div>
          <h2 className="section-title">
            One orchestration layer<br />
            <span className="text-[var(--accent-bright)]">for business operations.</span>
          </h2>
          <p className="t-body mt-4">Connect signals, reasoning, and execution into one AI-native operational system.</p>
          <div className="my-5 h-px w-full bg-white/10" />
        </div>

        <div className="architecture-reveal architecture-diagram">
          {PANELS.map((panel, index) => (
            <Fragment key={panel.label}>
              <article className="architecture-panel">
                <div className="architecture-panel-header">
                  <span>{panel.label}</span>
                  <span className="flex items-center gap-2 text-[8px]">
                    <span className="pulse-dot" />
                    {panel.status}
                  </span>
                </div>

                <div className="architecture-panel-body">
                  <h3 className="font-serif text-[24px] leading-none text-white">{panel.title}</h3>
                  <div className="mt-8 flex flex-col gap-5">
                    {panel.items.map((item) => (
                      <div key={item} className="architecture-item">{item}</div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className="font-serif text-[48px] leading-none text-[var(--accent-bright)]">{panel.stat}</div>
                    <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">{panel.statLabel}</div>
                  </div>
                </div>
              </article>
              {index < PANELS.length - 1 && <Divider />}
            </Fragment>
          ))}
          <div className="architecture-bottom-bar">
            Built for production environments: secure routing, cloud-native deployment, audit visibility, rollback protection, and enterprise-scale orchestration.
          </div>
        </div>
      </div>
    </section>
  );
}
