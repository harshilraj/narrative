"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const content = sectionRef.current.querySelectorAll(".cta-content > *");

    gsap.fromTo(content,
      { opacity: 0, y: 20, filter: "blur(2px)" },
      {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%" }
      }
    );
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="section relative overflow-hidden">

      {/* Atmospheric depth */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,127,255,0.08) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 grid-bg-fine opacity-30" />
      </div>

      <div className="container relative z-10">
        <div className="glass-card max-w-3xl mx-auto flex flex-col items-center text-center cta-content">

          <div className="section-eyebrow mb-5">START WITH THE OPERATING MAP</div>

          <h2 className="t-h2 text-balance mb-6 font-serif" style={{ fontSize: "clamp(2.25rem, 5vw, 3.7rem)", lineHeight: 1.1 }}>
            The companies adopting AI infrastructure now will define operational speed for the next decade.
          </h2>

          <p className="t-body text-center opacity-80" style={{ maxWidth: "500px", margin: "0 auto 2.25rem", fontSize: "1.05rem" }}>
            Narrative AI helps businesses automate execution, reduce operational overhead, and deploy AI systems that scale with real-world complexity.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-10 md:mb-12">
            <a href="mailto:hello@narrative-ai.com" className="btn-primary" style={{ padding: "16px 36px", fontSize: "0.9375rem" }}>
              Start System Audit
            </a>
            <a href="#infrastructure" className="btn-secondary" style={{ padding: "16px 36px", fontSize: "0.75rem" }}>
              Explore Architecture
            </a>
          </div>

          {/* Final trust bar */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Enterprise-ready deployment", "AWS", "Google Cloud", "Azure", "SOC 2-ready infrastructure"].map((item) => (
              <span key={item} className="cloud-pill">{item}</span>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
