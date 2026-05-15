"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const SYSTEM_POINTS = [
  "Operational map",
  "Cloud integration",
  "Decision routing",
  "Execution layer",
  "Audit visibility",
];

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".cta-reveal"),
      { opacity: 0, y: 24, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 64%" },
      }
    );
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="section cta-system-section relative overflow-hidden">
      <div className="container relative z-10">
        <div className="cta-system">
          <div className="cta-map cta-reveal" aria-hidden="true">
            <div className="map-core">
              <span>Narrative AI</span>
            </div>
            {SYSTEM_POINTS.map((point, index) => (
              <div key={point} className={`map-node map-node-${index + 1}`}>
                <span>{point}</span>
              </div>
            ))}
            <div className="map-orbit map-orbit-a" />
            <div className="map-orbit map-orbit-b" />
          </div>

          <div className="cta-copy cta-reveal">
            <div className="section-eyebrow mb-5">START WITH THE OPERATING MAP</div>
            <h2 className="section-title text-balance">Enter the operational layer before the market does.</h2>
            <p className="t-body mt-6">Narrative AI helps businesses identify where execution breaks, then deploys the AI infrastructure that makes work faster, observable, and scalable.</p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href="mailto:hello@narrative-ai.com" className="btn-primary">Start System Audit</a>
              <a href="#infrastructure" className="btn-secondary">Explore Architecture</a>
            </div>

            <div className="cta-trust-row">
              <span>Enterprise deployment</span>
              <span>AWS</span>
              <span>Google Cloud</span>
              <span>Azure</span>
              <span>Audit-ready systems</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
