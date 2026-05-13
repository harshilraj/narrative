"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SystemCanvas = dynamic(() => import("./SystemCanvas"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function IntelligentOS() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getSceneOpacity = (start: number, end: number, fadeOut: number = 0.1) => {
    if (progress < start - fadeOut) return 0;
    if (progress > end + fadeOut) return 0;
    if (progress >= start && progress <= end) return 1;
    if (progress < start) return (progress - (start - fadeOut)) / fadeOut;
    return 1 - (progress - end) / fadeOut;
  };

  return (
    <section ref={containerRef} className="relative w-full h-[500vh] bg-[#070B14] text-[#F3F6FB]">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Spatial Background Engine */}
        <div className="absolute inset-0 z-0">
          <SystemCanvas progress={progress} />
        </div>

        {/* DOM Overlay UI */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          
          {/* SCENE 1: HERO / THE PROBLEM (0 - 0.25) */}
          <div 
            className="absolute left-6 md:left-20 max-w-3xl transform -translate-y-1/2 top-1/2"
            style={{ 
              opacity: getSceneOpacity(0, 0.22),
              transform: `translateY(calc(-50% + ${(progress * 150)}px))`,
            }}
          >
            <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.1]">
              Intelligence <br />
              <span className="text-[#8FA1B8]">is not an add-on.</span>
            </h1>
            <p className="text-[#8FA1B8] text-lg md:text-xl leading-relaxed max-w-xl font-light">
              Most businesses bolt AI on top of broken systems, leading to operational chaos. We engineer intelligent systems that run gracefully from the core.
            </p>
          </div>

          {/* SCENE 2: ORCHESTRATION (0.25 - 0.5) */}
          <div 
            className="absolute right-6 md:right-24 max-w-2xl transform -translate-y-1/2 top-1/2 text-right flex flex-col items-end"
            style={{ 
              opacity: getSceneOpacity(0.28, 0.47),
              transform: `translateY(calc(-50% + ${((progress - 0.25) * -150)}px))`,
            }}
          >
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-8 leading-[1.1]">
              From fragmentation <br />
              <span className="text-[#7DD3FC]">to orchestration.</span>
            </h2>
            <div className="border-r-2 border-[#7DD3FC] pr-6">
              <p className="text-[#8FA1B8] text-lg leading-relaxed max-w-md font-light text-right">
                We replace disconnected tools with synchronized workflows. Every data point routes intelligently, allowing your business to operate as a single, coherent machine.
              </p>
            </div>
          </div>

          {/* SCENE 3: ARCHITECTURE ENGINE (0.5 - 0.75) */}
          <div 
            className="absolute left-6 md:left-24 max-w-2xl transform -translate-y-1/2 top-1/2"
            style={{ 
              opacity: getSceneOpacity(0.53, 0.72),
              transform: `translateY(calc(-50% + ${((progress - 0.5) * 150)}px))`,
            }}
          >
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-8 leading-[1.1]">
              Architectural <br />
              precision.
            </h2>
            <div className="border-l-2 border-[#A78BFA] pl-6">
              <p className="text-[#8FA1B8] text-lg leading-relaxed mb-8 max-w-md font-light">
                We blueprint deep cloud infrastructure and spatial data pipelines before execution begins. No guesswork. Pure engineering.
              </p>
              <div className="flex gap-4 opacity-70">
                <div className="px-4 py-2 border border-[#ffffff20] rounded-full text-xs tracking-widest text-[#F3F6FB] uppercase">AWS</div>
                <div className="px-4 py-2 border border-[#ffffff20] rounded-full text-xs tracking-widest text-[#F3F6FB] uppercase">GCP</div>
                <div className="px-4 py-2 border border-[#ffffff20] rounded-full text-xs tracking-widest text-[#F3F6FB] uppercase">MLOps</div>
              </div>
            </div>
          </div>

          {/* SCENE 4: CALM SCALE (0.75 - 1.0) */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-[45%] text-center w-full px-6 flex flex-col items-center"
            style={{ 
              opacity: getSceneOpacity(0.78, 1.0),
              transform: `translate(-50%, calc(-50% + ${((progress - 0.75) * -100)}px))`,
            }}
          >
            <h2 className="text-5xl md:text-8xl font-medium tracking-tight mb-6 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              Calm scale.
            </h2>
            <p className="text-[#8FA1B8] text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-light tracking-wide">
              Complexity resolved. Your intelligent system is online.
            </p>
            <a href="#contact" className="px-8 py-4 bg-white text-black rounded-full font-medium tracking-wide hover:scale-105 transition-transform duration-300 pointer-events-auto">
              Start a Project
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
