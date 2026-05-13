"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FLOW_STEPS = [
  { id: "01", title: "Discovery", desc: "Mapping manual chaos and establishing operational bounds." },
  { id: "02", title: "Blueprint", desc: "Architecting the routing layer and deployment nodes." },
  { id: "03", title: "Build", desc: "Constructing the LLM orchestration and workflow integrations." },
  { id: "04", title: "Deployment", desc: "Pushing active systems to GCP/AWS infrastructure." },
  { id: "05", title: "Autonomous Optimization", desc: "Continuous latency and prompt refinement loops." }
];

export default function ProcessFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    // Orchestration line draw
    gsap.fromTo(
      lineRef.current,
      { width: "0%" },
      {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      }
    );
  }, []);

  return (
    <section id="process" className="w-full bg-transparent py-32 px-6 md:px-20 border-t border-[rgba(255,255,255,0.02)] relative overflow-hidden">
      
      {/* Background architectural grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10" ref={containerRef}>
        
        <div className="mb-24">
          <h2 className="text-3xl md:text-5xl font-medium text-[#F3F6FB] tracking-tight">
            System Assembly.
          </h2>
        </div>

        <div className="relative mt-20">
          
          {/* Base Track */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#1A2333]" />
          
          {/* Animated Active Line */}
          <div ref={lineRef} className="absolute top-0 left-0 h-[1px] bg-[#7DD3FC] shadow-[0_0_15px_rgba(125,211,252,0.8)] z-10 origin-left" />

          {/* Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pt-8">
            {FLOW_STEPS.map((step, idx) => (
              <div key={idx} className="flex flex-col relative group">
                
                {/* Node Connection */}
                <div className="absolute -top-[37px] left-0 w-2 h-2 rounded-full bg-[#0F1726] border border-[#1A2333] group-hover:border-[#7DD3FC] transition-colors duration-500 z-20" />
                <div className="absolute -top-[37px] left-0 w-2 h-2 rounded-full bg-[#7DD3FC] opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500 z-10" />
                
                {/* Content */}
                <span className="text-[10px] font-mono text-[#8FA1B8] mb-4 opacity-50">NODE {step.id}</span>
                <h3 className="text-xl font-medium text-[#F3F6FB] mb-3">{step.title}</h3>
                <p className="text-[#8FA1B8] text-sm leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
