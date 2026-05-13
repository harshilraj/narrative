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
    <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-transparent">
      
      {/* Soft atmospheric integration */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(3,4,8,0.4) 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-64 z-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, transparent)" }} />

      <div className="container relative z-20 flex flex-col items-center justify-center text-center px-4" ref={contentRef}>
        
        {/* Center Content */}
        <div className="flex flex-col items-center max-w-4xl mt-24 md:mt-32">
          
          {/* Operational Strip */}
          <div data-reveal className="mb-16 flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-[9px] uppercase tracking-widest text-white/60 font-medium">Active Orchestration</span>
            <span className="text-white/10 text-[9px]">|</span>
            <span className="text-[9px] uppercase tracking-widest text-white/40">Workflows Live</span>
          </div>

          <h1 data-reveal className="t-h1 text-balance font-serif" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
            Operational intelligence,<br/>
            designed to disappear<br/>
            into the workflow.
          </h1>
          
          <p data-reveal className="mt-8 text-white/50 font-light text-[1rem] md:text-[1.15rem] max-w-lg mx-auto" style={{ lineHeight: 1.6 }}>
            We build invisible infrastructure that routes, resolves, and optimizes complex operations in real time.
          </p>

          <div data-reveal className="mt-14 flex flex-col sm:flex-row items-center gap-5">
            <button className="px-7 py-3.5 bg-white text-black text-[11px] uppercase tracking-[0.2em] font-bold rounded hover:bg-white/90 transition-colors">
              Initialize System
            </button>
            <button className="px-7 py-3.5 bg-transparent border border-white/10 text-white/80 text-[11px] uppercase tracking-[0.2em] font-medium rounded hover:bg-white/5 transition-colors">
              View Architecture
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}
