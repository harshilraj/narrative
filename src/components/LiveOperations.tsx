"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/* ── Tiny sparkline component ── */
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 80, H = 24;
  const step = W / (values.length - 1);
  const pts = values.map((v, i) => `${i * step},${H - ((v - min) / range) * H}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <polyline fill="none" stroke={color} strokeWidth="1.5"
        points={pts} strokeLinejoin="round" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/* ── Animated counter ── */
function Counter({ end, suffix = "", duration = 1600 }: { end: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

const OPS = [
  {
    id: "routing",
    status: "ACTIVE",
    label: "AI Routing Layer",
    desc: "Classifying requests, assigning owners, and preparing context across 14 workspaces",
    metric: "Efficiency Gain",
    value: 63,
    unit: "%",
    color: "#5B8EF0",
    sparkData: [40, 45, 42, 55, 58, 61, 59, 63],
    ping: "12ms avg",
  },
  {
    id: "resolution",
    status: "ACTIVE",
    label: "Autonomous Resolution Engine",
    desc: "Resolving routine exceptions and escalating only the cases that need judgment",
    metric: "Manual Intervention",
    value: 82,
    unit: "% removed",
    color: "#8B6CF0",
    sparkData: [20, 35, 48, 55, 60, 72, 78, 82],
    ping: "99.98% uptime",
  },
  {
    id: "workflow",
    status: "ACTIVE",
    label: "Workflow Processing Grid",
    desc: "Synchronizing event streams across AWS Lambda and GCP Pub/Sub",
    metric: "Execution Latency",
    value: 0.8,
    unit: "s",
    color: "#3DB8F5",
    sparkData: [3.2, 2.8, 2.1, 1.8, 1.4, 1.1, 0.9, 0.8],
    ping: "128 active",
  },
  {
    id: "infra",
    status: "ACTIVE",
    label: "Infrastructure Health Monitor",
    desc: "Monitoring 47 services across three cloud regions with health checks and alerts",
    metric: "Uptime Stability",
    value: 99.98,
    unit: "%",
    color: "#34D399",
    sparkData: [98.2, 99.1, 99.4, 99.7, 99.8, 99.9, 99.95, 99.98],
    ping: "47 services",
  },
];

export default function LiveOperations() {
  const [tick, setTick] = useState(0);
  const [timeStr, setTimeStr] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTimeStr(new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC");
    const tId = setInterval(() => {
      setTimeStr(new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC");
    }, 1000);
    return () => clearInterval(tId);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const header = sectionRef.current.querySelectorAll(".ops-header");
    const panel = sectionRef.current.querySelector(".ops-panel");
    const rows = sectionRef.current.querySelectorAll(".ops-row");

    gsap.fromTo(header,
      { opacity: 0, y: 30, filter: "blur(8px)" },
      {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.1, ease: "power4.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%" }
      }
    );

    gsap.fromTo(panel,
      { opacity: 0, y: 40, filter: "blur(8px)", scale: 0.98 },
      {
        opacity: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 1.2, ease: "power4.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 55%" }
      }
    );

    gsap.fromTo(rows,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0, duration: 1.2, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 50%" }
      }
    );
  }, []);

  return (
    <section id="process" ref={sectionRef} className="section relative">
      <div className="container relative z-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-9 md:mb-10 ops-header">
          <div>
            <div className="t-label tracking-widest uppercase opacity-70 mb-4">Operational Status</div>
            <h2 className="t-h2 font-serif text-balance" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Live execution center.</h2>
          </div>
          <div className="active-badge">
            <div className="pulse-dot" />
            <span className="t-small uppercase tracking-widest text-xs font-medium opacity-80">
              All systems nominal
            </span>
            <span className="opacity-30 text-xs">|</span>
            <span className="t-small uppercase tracking-widest text-xs font-medium opacity-60">
              Sync {tick}s ago
            </span>
          </div>
        </div>

        {/* Command Panel */}
        <div data-parallax="0.04" className="ops-panel glass-card relative overflow-hidden"
          style={{ background: "rgba(6,8,15,0.6)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)" }}>

          {/* Scanlines */}
          <div className="scanlines absolute inset-0 pointer-events-none opacity-20 z-10" />

          {/* Panel Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-4">
              <div className="pulse-dot" />
              <span className="t-mono text-xs opacity-70">
                NARRATIVE_AI // ORCHESTRATION_CORE // v2.4.1
              </span>
            </div>
            <div className="t-mono text-xs opacity-40">
              {timeStr || "SYNCING..."}
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {OPS.map((op) => (
              <div key={op.id} className="ops-row grid grid-cols-1 lg:grid-cols-12 gap-6 px-8 py-5 items-center
                hover:bg-white hover:bg-opacity-[0.02] transition-colors duration-300">

                {/* Status + label */}
                <div className="lg:col-span-4 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="active-badge t-mono uppercase tracking-wider font-medium">
                      <span className="pulse-dot" /> {op.status}
                    </span>
                  </div>
                  <div className="font-serif font-medium tracking-wide" style={{ color: "var(--text)", fontSize: "1.1rem" }}>
                    {op.label}
                  </div>
                  <div className="t-small opacity-60" style={{ fontSize: "0.85rem" }}>
                    {op.desc}
                  </div>
                </div>

                {/* Sparkline */}
                <div className="lg:col-span-3 flex items-center gap-6">
                  <Sparkline values={op.sparkData} color={op.color} />
                  <span className="t-mono opacity-50" style={{ fontSize: "10px" }}>
                    {op.ping}
                  </span>
                </div>

                {/* Metric */}
                <div className="lg:col-span-3 flex flex-col">
                  <span className="t-mono mb-1.5 opacity-50" style={{ fontSize: "10px", textTransform: "uppercase" }}>{op.metric}</span>
                  <span style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: "1.8rem",
                    fontWeight: 400,
                    letterSpacing: "-0.04em",
                    color: op.color,
                  }}>
                    <Counter end={typeof op.value === "number" ? op.value : 0} suffix={op.unit} />
                  </span>
                </div>

                {/* Action */}
                <div className="lg:col-span-2 flex justify-end">
                  <button className="btn-secondary t-mono" style={{ fontSize: "10px", padding: "9px 20px" }}>
                    Inspect →
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
