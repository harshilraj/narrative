"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const SUPPORTING = [
  {
    title: "Customer support automation",
    copy: "AI triage and workflow routing across support operations.",
    tags: ["Support Ops", "Routing", "SLA Control"],
  },
  {
    title: "Logistics intelligence",
    copy: "Automated shipment exception handling and escalation routing.",
    tags: ["Logistics", "Exceptions", "Escalation"],
  },
  {
    title: "Internal operations layer",
    copy: "Cross-team workflow orchestration with AI-triggered execution.",
    tags: ["Internal Ops", "Approvals", "Execution"],
  },
];

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".results-reveal"),
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
    <section id="case-studies" ref={sectionRef} className="section results-section relative overflow-hidden">
      <div className="container relative z-10">
        <div className="results-reveal mb-10 max-w-3xl">
          <div className="section-eyebrow mb-4">RESULTS</div>
          <h2 className="section-title text-balance">Real deployments. Measurable outcomes.</h2>
        </div>

        <article className="results-reveal featured-case">
          <div className="featured-case-grid">
            <div>
              <div className="section-eyebrow mb-5">ENTERPRISE OPERATIONS AUTOMATION</div>
              <h3 className="font-serif text-[44px] leading-none text-white">Reduced manual operational workload by 78%.</h3>
              <p className="t-body mt-6 max-w-xl">Narrative AI unified intake, routing, approvals, and reporting into one orchestration layer - eliminating repetitive coordination across operations teams.</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {["AWS", "OpenAI", "Kafka", "PostgreSQL", "Google Cloud"].map((item) => (
                  <span key={item} className="tag-chip">{item}</span>
                ))}
              </div>
            </div>

            <div className="featured-metrics">
              {[
                ["78%", "Reduction in manual processing"],
                ["4.2x", "Faster operational turnaround"],
                ["24/7", "Automated execution coverage"],
                ["Full", "Audit visibility"],
              ].map(([value, label]) => (
                <div key={label} className="featured-metric">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <div className="results-reveal supporting-grid mt-6">
          {SUPPORTING.map((card) => (
            <article key={card.title} className="support-card">
              <h3 className="font-serif text-[26px] leading-none text-white">{card.title}</h3>
              <p className="t-body mt-4">{card.copy}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span key={tag} className="tag-chip">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
