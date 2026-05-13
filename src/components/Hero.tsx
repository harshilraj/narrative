"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const els = contentRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(els,
      { opacity: 0, y: 20, filter: "blur(6px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, stagger: 0.1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <section className="relative w-full min-h-[92vh] md:min-h-screen flex flex-col justify-center overflow-hidden bg-transparent">
      
      {/* Soft atmospheric integration */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(5,10,10,0.06) 0%, rgba(5,10,10,0.18) 70%, rgba(5,10,10,0.46) 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-64 z-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, transparent)" }} />

      <div className="container relative z-20 flex flex-col items-center justify-center text-center px-4" ref={contentRef}>
        
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
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] shadow-[0_0_12px_rgba(0,255,178,0.9)] animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-white/70 font-medium">Operations layer online</span>
            <span className="text-white/20 text-[10px]">|</span>
            <span className="text-[10px] uppercase tracking-widest text-white/50">Real systems, not demos</span>
          </div>

          <h1 data-reveal className="t-h1 text-balance" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", lineHeight: 1.02, letterSpacing: 0, textShadow: "0 20px 80px rgba(0,0,0,0.6)" }}>
            AI systems that turn<br />
            daily operations into<br />
            reliable execution.
          </h1>
          
          <p data-reveal className="mt-8 text-white/62 font-light text-[1rem] md:text-[1.15rem] max-w-2xl mx-auto" style={{ lineHeight: 1.6 }}>
            Narrative AI designs the orchestration layer between your data, teams, tools, and models so work moves cleanly from signal to decision to action.
          </p>

          <div data-reveal className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-4">
            <a href="#contact" className="px-8 py-4 bg-white text-black text-[11px] uppercase tracking-[0.22em] font-bold rounded hover:bg-white/90 transition-colors" style={{ fontFamily: "'DM Mono', monospace" }}>
              PLAN MY SYSTEM
            </a>
            <a href="#infrastructure" className="px-8 py-4 bg-transparent border border-white/18 text-white/80 text-[11px] uppercase tracking-[0.22em] font-medium rounded hover:bg-white/5 transition-colors" style={{ fontFamily: "'DM Mono', monospace" }}>
              SEE THE ARCHITECTURE
            </a>
          </div>
        </div>

      </div>

    </section>
  );
}
