"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    phase: "System Analysis",
    title: "Discovery",
    desc: "We map every manual workflow, API boundary, and data flow to establish precise architectural intent.",
    detail: ["Process interviews", "Workflow mapping", "Bottleneck analysis", "Integration audit"],
    accent: "#5B8EF0",
    status: "ANALYZING",
  },
  {
    num: "02",
    phase: "Architecture Mapping",
    title: "Blueprint",
    desc: "A complete system architecture before a single line of code. You see exactly how AI models, databases, and APIs interact.",
    detail: ["System diagrams", "AI stack selection", "Infrastructure plan", "Cost modelling"],
    accent: "#8B6CF0",
    status: "MAPPING",
  },
  {
    num: "03",
    phase: "AI Workflow Construction",
    title: "Build",
    desc: "Parallel tracks for AI orchestration, cloud infrastructure, and integration layers built for determinism and observability.",
    detail: ["LLM orchestration", "API integration", "Cloud provisioning", "CI/CD pipelines"],
    accent: "#3DB8F5",
    status: "CONSTRUCTING",
  },
  {
    num: "04",
    phase: "Infrastructure Deployment",
    title: "Deployment",
    desc: "Zero-downtime rollout with canary testing and staged activation. Full monitoring established before go-live.",
    detail: ["Staged rollout", "Load testing", "Health monitoring", "Runbook creation"],
    accent: "#F59E0B",
    status: "DEPLOYING",
  },
  {
    num: "05",
    phase: "Autonomous Optimization",
    title: "Optimization",
    desc: "Continuous latency reduction, prompt refinement, and cost optimization. The system improves autonomously.",
    detail: ["Model evaluation", "Prompt tuning", "Cost analysis", "Performance reviews"],
    accent: "#34D399",
    status: "OPTIMIZING",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !spineRef.current) return;

    // Header reveal
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".process-header"),
      { opacity: 0, y: 24, filter: "blur(4px)" },
      {
        opacity: 1, y: 0, filter: "blur(0px)",
        duration: 1.0, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      }
    );

    // Draw the central spine as user scrolls — scrub for precise control
    gsap.fromTo(
      spineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 85%",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      }
    );

    // Each step fades in as the spine reaches it
    const steps = sectionRef.current.querySelectorAll(".process-step");
    steps.forEach((step, i) => {
      gsap.fromTo(
        step,
        { opacity: 0, x: i % 2 === 0 ? -30 : 30, filter: "blur(3px)" },
        {
          opacity: 1, x: 0, filter: "blur(0px)",
          duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate signal dot on each step
      const dot = step.querySelector(".step-dot");
      if (dot) {
        gsap.fromTo(
          dot,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.5, ease: "back.out(2)",
            scrollTrigger: {
              trigger: step,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate branch line
      const branch = step.querySelector(".step-branch");
      if (branch) {
        gsap.fromTo(
          branch,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1, opacity: 1,
            duration: 0.6, ease: "power2.out",
            scrollTrigger: {
              trigger: step,
              start: "top 77%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });
  }, []);

  return (
    <section id="results" ref={sectionRef} className="section relative">
      {/* Atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(61,184,245,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10">
        {/* Header */}
        <div className="mb-16 process-header">
          <div className="t-label tracking-widest uppercase opacity-70 mb-4">Deployment Sequence</div>
          <h2 className="t-h2 font-serif text-balance" style={{ fontSize: "clamp(2rem, 3.5vw, 3.2rem)" }}>
            An evolving<br />orchestration pipeline.
          </h2>
          <p className="t-body opacity-70 mt-4 max-w-xl" style={{ fontSize: "1.05rem" }}>
            Not a timeline. A live sequence of infrastructure states that activates progressively,
            layer by layer, until your system operates autonomously.
          </p>
        </div>

        {/* Pipeline */}
        <div className="relative">
          {/* Central spine — GPU-composited */}
          <div
            className="absolute left-[24px] top-0 bottom-0 w-[2px] bg-white/[0.04]"
            style={{ willChange: "transform" }}
          >
            {/* Filled spine drawn by scroll */}
            <div
              ref={spineRef}
              className="w-full origin-top"
              style={{
                height: "100%",
                background: "linear-gradient(to bottom, #5B8EF0, #8B6CF0, #3DB8F5, #F59E0B, #34D399)",
                boxShadow: "0 0 12px rgba(91,142,240,0.3)",
              }}
            />
          </div>

          <div className="flex flex-col gap-12 relative">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="process-step relative flex items-start gap-10 pl-16"
                style={{ willChange: "transform" }}
              >
                {/* Node dot on spine */}
                <div
                  className="step-dot absolute left-[15px] top-5 w-[20px] h-[20px] rounded-full z-10 flex-shrink-0"
                  style={{
                    background: "#030408",
                    border: `2px solid ${step.accent}`,
                    boxShadow: `0 0 16px ${step.accent}70`,
                  }}
                >
                  <div
                    className="absolute inset-[3px] rounded-full"
                    style={{ background: step.accent }}
                  />
                </div>

                {/* Branch line from spine to card */}
                <div
                  className="step-branch absolute left-[24px] top-[22px] h-px w-10 origin-left"
                  style={{
                    background: `linear-gradient(to right, ${step.accent}60, transparent)`,
                  }}
                />

                {/* Content card */}
                <div
                  className="flex-1 relative rounded-2xl p-8 border transition-all duration-500 group"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.035)";
                    (e.currentTarget as HTMLElement).style.borderColor = `${step.accent}30`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${step.accent}0a`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {/* Card header row */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="t-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded"
                        style={{ color: step.accent, background: `${step.accent}12` }}
                      >
                        Phase {step.num}
                      </span>
                      <h3
                        className="font-serif font-medium m-0"
                        style={{ fontSize: "1.25rem", color: "#EEF2F8" }}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {/* Live status indicator */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: step.accent }}
                      />
                      <span
                        className="t-mono text-[9px] uppercase tracking-widest opacity-50"
                        style={{ color: step.accent }}
                      >
                        {step.status}
                      </span>
                    </div>
                  </div>

                  <p
                    className="t-body opacity-60 mb-6"
                    style={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                  >
                    {step.desc}
                  </p>

                  {/* State indicators */}
                  <div className="flex flex-wrap gap-2">
                    {step.detail.map((d) => (
                      <span
                        key={d}
                        className="t-mono text-[10px] px-3 py-1.5 rounded-md text-white/40 tracking-wide"
                        style={{
                          background: `${step.accent}07`,
                          border: `1px solid ${step.accent}18`,
                        }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Flow arrow to next */}
                  {i < STEPS.length - 1 && (
                    <div
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 t-mono text-[10px] opacity-20 flex flex-col items-center gap-1"
                    >
                      <div className="w-px h-5" style={{ background: `linear-gradient(to bottom, ${step.accent}60, transparent)` }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
