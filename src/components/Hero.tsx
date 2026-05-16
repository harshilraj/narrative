"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero({ initialized }: { initialized: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current || !initialized) return;
    const els = contentRef.current.querySelectorAll("[data-reveal]");
    gsap.killTweensOf(els);
    gsap.fromTo(
      els,
      { opacity: 0, y: 18, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.15, stagger: 0.12, ease: "power3.out", delay: 0.08 }
    );
  }, [initialized]);

  return (
    <section className={`hero-section relative w-full min-h-[92vh] md:min-h-screen flex flex-col justify-center overflow-hidden bg-transparent ${initialized ? "hero-initialized" : ""}`}>
      
      {/* Soft atmospheric integration */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(2,1,15,0.04) 0%, rgba(2,1,15,0.18) 70%, rgba(2,1,15,0.5) 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-64 z-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, transparent)" }} />

      <div className="container relative z-20 flex flex-col items-center justify-center text-center px-4 hero-content" ref={contentRef}>
        
        {/* Center Content */}
        <div className="flex flex-col items-center max-w-5xl mt-20 md:mt-28">
          
          {/* Operational Strip */}
          <div
            data-reveal
            className="mb-10 md:mb-12 flex items-center gap-3 rounded-full px-5 py-2"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            <div className="pulse-dot" />
            <span className="text-[10px] uppercase tracking-widest text-white/70 font-medium">Operations layer online</span>
          </div>

          <h1 data-reveal className="t-h1 text-balance" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", lineHeight: 1.02, letterSpacing: 0, textShadow: "0 20px 80px rgba(0,0,0,0.6)" }}>
            Build the operating<br />
            layer your business<br />
            actually needs.
          </h1>
          
          <p data-reveal className="mt-8 text-white/62 font-light text-[1rem] md:text-[1.15rem] max-w-2xl mx-auto" style={{ lineHeight: 1.6 }}>
            Narrative AI connects workflows, cloud systems, data, and models into one intelligent execution layer - reducing repetitive operations, accelerating decisions, and automating work at scale.
          </p>

          <div data-reveal className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-4">
            <a href="#contact" className="btn-primary text-[11px] uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>
              BUILD MY SYSTEM
            </a>
            <a href="#infrastructure" className="btn-secondary text-[11px] uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>
              EXPLORE ARCHITECTURE
            </a>
          </div>

          <div data-reveal className="mt-10 hero-infra-line">
            <span>AWS-ready infrastructure</span>
            <span>Google Cloud deployment</span>
            <span>Azure-compatible systems</span>
          </div>
        </div>

      </div>

    </section>
  );
}
