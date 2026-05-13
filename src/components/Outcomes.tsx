import React from "react";

export default function Outcomes() {
  return (
    <section id="proof" className="w-full bg-[rgba(7,11,20,0.6)] backdrop-blur-md py-40 px-6 md:px-20 border-t border-[rgba(255,255,255,0.02)]">
      <div className="max-w-7xl mx-auto flex flex-col gap-32">
        
        {/* Massive Editorial Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <h2 className="text-8xl md:text-[12rem] leading-none font-medium text-[#F3F6FB] tracking-tighter -ml-2">
              63<span className="text-[#8FA1B8]">%</span>
            </h2>
          </div>
          <div className="md:col-span-4 pb-4 md:pb-12 border-b border-[rgba(255,255,255,0.1)]">
            <p className="text-2xl text-[#8FA1B8] font-light tracking-wide">
              automation overhead removed.
            </p>
          </div>
        </div>

        {/* Massive Editorial Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <h2 className="text-8xl md:text-[12rem] leading-none font-medium text-[#F3F6FB] tracking-tighter -ml-2">
              0.8<span className="text-[#8FA1B8]">s</span>
            </h2>
          </div>
          <div className="md:col-span-4 pb-4 md:pb-12 border-b border-[rgba(255,255,255,0.1)]">
            <p className="text-2xl text-[#8FA1B8] font-light tracking-wide">
              workflow execution latency.
            </p>
          </div>
        </div>

        {/* Massive Editorial Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <h2 className="text-8xl md:text-[12rem] leading-none font-medium text-[#F3F6FB] tracking-tighter -ml-2">
              24<span className="text-[#8FA1B8]">/7</span>
            </h2>
          </div>
          <div className="md:col-span-4 pb-4 md:pb-12 border-b border-[rgba(255,255,255,0.1)]">
            <p className="text-2xl text-[#8FA1B8] font-light tracking-wide">
              autonomous orchestration uptime.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
