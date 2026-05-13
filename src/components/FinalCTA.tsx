"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
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
          style={{ background: "radial-gradient(circle, rgba(91,142,240,0.04) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 grid-bg-fine opacity-30" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center cta-content">

          <div className="t-label tracking-widest uppercase opacity-70 mb-6">Begin Orchestration</div>

          <h2 className="t-h2 text-balance mb-8 font-serif" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.1 }}>
            Operational intelligence should feel invisible.
          </h2>

          <p className="t-body text-center mb-12 opacity-80" style={{ maxWidth: "440px", margin: "0 auto 3rem", fontSize: "1.05rem" }}>
            The best-built systems run silently in the background. We replace operational complexity with architecture that thinks for itself.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <a href="mailto:hello@narrative-ai.com" className="btn-primary" style={{ padding: "16px 36px", fontSize: "0.9375rem" }}>
              Get in Touch
            </a>
            <a href="#capabilities" className="btn-ghost" style={{ padding: "16px 36px", fontSize: "0.9375rem" }}>
              Explore Systems
            </a>
          </div>

          {/* Final trust bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-50">
            <div className="flex items-center gap-2">
              <div className="status-dot" style={{ width: 6, height: 6, boxShadow: "0 0 8px var(--success)" }} />
              <span className="t-mono uppercase tracking-widest" style={{ fontSize: "11px" }}>128 workflows operational</span>
            </div>
            <div className="w-px h-3 bg-white opacity-20" />
            <span className="t-mono uppercase tracking-widest" style={{ fontSize: "11px" }}>SOC 2 Type II</span>
            <div className="w-px h-3 bg-white opacity-20" />
            <span className="t-mono uppercase tracking-widest" style={{ fontSize: "11px" }}>AWS · GCP · Azure</span>
          </div>

        </div>
      </div>
    </section>
  );
}
