import React from "react";

const PROJECTS = [
  {
    client: "Fintech Startup",
    problem: "Manual review of 10,000+ daily compliance documents.",
    system: "Orchestrated RAG pipeline with parallel LLM processing on AWS.",
    result: "Processing time reduced from 4 hours to 12 seconds per batch.",
  },
  {
    client: "Enterprise Logistics",
    problem: "Fragmented supply chain alerts across 4 different platforms.",
    system: "Centralized AI routing agent deployed on GCP.",
    result: "Unified real-time dashboard with autonomous priority sorting.",
  }
];

export default function Work() {
  return (
    <section id="work" className="w-full bg-[rgba(15,23,38,0.85)] backdrop-blur-md py-32 px-6 md:px-20 border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-medium text-[#F3F6FB] tracking-tight mb-6">
            Production <span className="text-[#8FA1B8]">intelligence.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-12 md:gap-24">
          {PROJECTS.map((project, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 border-t border-[rgba(255,255,255,0.05)] pt-12">
              
              <div className="md:col-span-4 flex flex-col justify-between">
                <div>
                  <div className="px-3 py-1 mb-6 border border-[#38BDF8] rounded text-[10px] tracking-widest text-[#38BDF8] uppercase inline-block">
                    Case Study
                  </div>
                  <h3 className="text-2xl font-medium text-[#F3F6FB]">{project.client}</h3>
                </div>
              </div>

              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="flex flex-col gap-2">
                  <span className="text-[#8FA1B8] text-sm tracking-widest uppercase mb-2">The Problem</span>
                  <p className="text-[#F3F6FB] font-light leading-relaxed">{project.problem}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-[#7DD3FC] text-sm tracking-widest uppercase mb-2">The System</span>
                  <p className="text-[#F3F6FB] font-light leading-relaxed">{project.system}</p>
                </div>

                <div className="sm:col-span-2 flex flex-col gap-2 mt-4 pt-8 border-t border-[rgba(255,255,255,0.02)]">
                  <span className="text-[#A78BFA] text-sm tracking-widest uppercase mb-2">The Result</span>
                  <p className="text-[#F3F6FB] text-xl font-light leading-relaxed">{project.result}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
