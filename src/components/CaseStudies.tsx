"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function ComplianceDiagram() {
  return (
    <svg viewBox="0 0 500 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ background: "#030408" }}>
      <style>
        {`
          @keyframes data-flow { to { stroke-dashoffset: -20; } }
          @keyframes node-pulse { 0%, 100% { fill-opacity: 0.1; stroke-opacity: 0.3; } 50% { fill-opacity: 0.3; stroke-opacity: 0.8; } }
          .data-flow { animation: data-flow 1.5s linear infinite; stroke-dasharray: 4 6; }
          .data-flow-fast { animation: data-flow 0.8s linear infinite; stroke-dasharray: 4 6; }
          .node-pulse { animation: node-pulse 3s ease-in-out infinite; }
        `}
      </style>
      <defs>
        <pattern id="grid-c" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.05)"/>
        </pattern>
        <linearGradient id="grad-c" x1="0" y1="0" x2="500" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B6CF0" stopOpacity="0.8"/>
          <stop offset="1" stopColor="#3DB8F5" stopOpacity="0.8"/>
        </linearGradient>
      </defs>
      <rect width="500" height="360" fill="url(#grid-c)" />

      {/* Vector DB Nodes (Pinecone) */}
      <g opacity="0.8">
        <text x="40" y="50" fill="#6B7E96" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1">VECTOR INDEX</text>
        {[0,1,2,3,4].map(i => (
          <rect key={`v-${i}`} x="40" y={70 + i*35} width="60" height="20" rx="3" fill="#8B6CF0" className="node-pulse" style={{ animationDelay: `${i * 0.2}s` }} stroke="#8B6CF0" />
        ))}
      </g>

      {/* Routing paths */}
      <path d="M 100 80 C 150 80, 150 180, 200 180" stroke="#8B6CF0" strokeWidth="1.5" className="data-flow" opacity="0.6"/>
      <path d="M 100 115 C 150 115, 150 180, 200 180" stroke="#8B6CF0" strokeWidth="1.5" className="data-flow" opacity="0.6"/>
      <path d="M 100 150 C 150 150, 150 180, 200 180" stroke="#8B6CF0" strokeWidth="1.5" className="data-flow" opacity="0.6"/>
      <path d="M 100 185 C 150 185, 150 180, 200 180" stroke="#8B6CF0" strokeWidth="1.5" className="data-flow" opacity="0.6"/>
      <path d="M 100 220 C 150 220, 150 180, 200 180" stroke="#8B6CF0" strokeWidth="1.5" className="data-flow" opacity="0.6"/>

      {/* RAG Core */}
      <g transform="translate(200, 130)">
        <rect width="120" height="100" rx="8" fill="rgba(15,21,37,0.8)" stroke="url(#grad-c)" strokeWidth="2" className="node-pulse" />
        <circle cx="60" cy="30" r="12" fill="#3DB8F5" opacity="0.8" />
        <circle cx="60" cy="30" r="12" fill="none" stroke="#3DB8F5" strokeWidth="2" className="node-pulse" style={{ animationDelay: '0.5s' }} />
        <text x="60" y="65" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="JetBrains Mono" fontWeight="600">LLM EVAL</text>
        <text x="60" y="80" textAnchor="middle" fill="#6B7E96" fontSize="9" fontFamily="JetBrains Mono">Parallel Inference</text>
      </g>

      {/* Outputs */}
      <path d="M 320 180 C 370 180, 370 120, 420 120" stroke="#34D399" strokeWidth="2" className="data-flow-fast" opacity="0.8"/>
      <path d="M 320 180 C 370 180, 370 240, 420 240" stroke="#EF4444" strokeWidth="2" className="data-flow-fast" opacity="0.8"/>

      <g transform="translate(420, 105)">
        <rect width="60" height="30" rx="4" fill="rgba(52,211,153,0.1)" stroke="#34D399" strokeWidth="1.5" />
        <text x="30" y="19" textAnchor="middle" fill="#34D399" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">PASS</text>
      </g>
      <g transform="translate(420, 225)">
        <rect width="60" height="30" rx="4" fill="rgba(239,68,68,0.1)" stroke="#EF4444" strokeWidth="1.5" />
        <text x="30" y="19" textAnchor="middle" fill="#EF4444" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">FLAG</text>
      </g>
      
      {/* Metric Overlay */}
      <text x="40" y="320" fill="#6B7E96" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="1">LATENCY: 0.82s / DOC</text>
      <text x="40" y="335" fill="#6B7E96" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="1">THROUGHPUT: 10K/DAY</text>
    </svg>
  );
}

function LogisticsDiagram() {
  return (
    <svg viewBox="0 0 500 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ background: "#030408" }}>
      <style>
        {`
          @keyframes route-scan { 0% { stroke-dashoffset: 200; } 100% { stroke-dashoffset: 0; } }
          @keyframes core-spin { 100% { transform: rotate(360deg); } }
          .route-scan { stroke-dasharray: 100 100; animation: route-scan 2s linear infinite; }
          .core-spin { transform-origin: 250px 180px; animation: core-spin 10s linear infinite; }
        `}
      </style>
      <defs>
        <radialGradient id="glow-l" cx="50%" cy="50%" r="50%">
          <stop stopColor="#3DB8F5" stopOpacity="0.2"/>
          <stop offset="1" stopColor="#030408" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      {/* Background Glow */}
      <circle cx="250" cy="180" r="150" fill="url(#glow-l)"/>
      
      {/* Concentric Rings */}
      <circle cx="250" cy="180" r="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4"/>
      <circle cx="250" cy="180" r="140" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/>

      {/* Nodes on outer ring */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 250 + Math.cos(rad) * 140;
        const y = 180 + Math.sin(rad) * 140;
        const color = i % 2 === 0 ? "#5B8EF0" : "#34D399";
        return (
          <g key={`l-${i}`}>
            <circle cx={x} cy={y} r="6" fill={color} opacity="0.8"/>
            <path d={`M ${x} ${y} L 250 180`} stroke={color} strokeWidth="1.5" className="route-scan" opacity="0.6"/>
          </g>
        );
      })}

      {/* Central Orchestration Core */}
      <g className="core-spin">
        <circle cx="250" cy="180" r="40" fill="rgba(15,21,37,0.9)" stroke="#3DB8F5" strokeWidth="2" />
        <circle cx="250" cy="180" r="30" stroke="#8B6CF0" strokeWidth="1" strokeDasharray="10 5" />
        <polygon points="250,150 270,195 230,195" fill="none" stroke="#3DB8F5" strokeWidth="1.5" opacity="0.5"/>
      </g>
      
      <text x="250" y="184" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">ROUTER</text>

      {/* Stats/Metrics UI Boxes */}
      <g transform="translate(30, 30)">
        <rect width="130" height="50" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <text x="15" y="20" fill="#6B7E96" fontSize="9" fontFamily="JetBrains Mono">EXCEPTION RATE</text>
        <text x="15" y="40" fill="#34D399" fontSize="16" fontFamily="JetBrains Mono" fontWeight="bold">↓ 82%</text>
      </g>
      
      <g transform="translate(340, 280)">
        <rect width="130" height="50" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <text x="15" y="20" fill="#6B7E96" fontSize="9" fontFamily="JetBrains Mono">RESOLUTION TIME</text>
        <text x="15" y="40" fill="#3DB8F5" fontSize="16" fontFamily="JetBrains Mono" fontWeight="bold">12s AVG</text>
      </g>
    </svg>
  );
}

const STUDIES = [
  {
    id: "fintech",
    industry: "Financial Services",
    client: "Tier-1 Regulatory Compliance",
    challenge: "Manual review of 10,000+ daily regulatory documents created a 4-hour processing lag and immense compliance overhead. Legacy parsers consistently failed on edge cases.",
    architecture: "Multi-Agent RAG Pipeline on AWS",
    technical: [
      "Vector embeddings using precise models stored in Pinecone.",
      "Parallel LLM evaluation agents cross-verifying compliance clauses.",
      "Kafka event streaming to process documents instantly upon ingestion.",
      "Deterministic fallback logic to guarantee absolute precision on critical fields."
    ],
    impact: ["0.82s execution latency per document", "Fully autonomous compliance pipeline", "Significant operational overhead removed"],
    diagram: <ComplianceDiagram />,
  },
  {
    id: "logistics",
    industry: "Supply Chain & Logistics",
    client: "Global Freight Routing Matrix",
    challenge: "Alert fragmentation across WMS, TMS, and ERP platforms created a 24-hour response lag to supply chain exceptions. This resulted in consistent missed delivery SLAs.",
    architecture: "Autonomous Event Router on GCP",
    technical: [
      "Vertex AI endpoints structured for strict exception classification.",
      "Pub/Sub streams aggregating disparate legacy systems into a unified event bus.",
      "Dynamic routing logic evaluating SLA risk and auto-dispatching carrier APIs.",
      "Human-in-the-loop escalation systems built exclusively for high-risk anomalies."
    ],
    impact: ["12s exception resolution", "82% alerts resolved autonomously", "Unified data stream for strict audit logging"],
    diagram: <LogisticsDiagram />,
  },
];

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Title reveal
    gsap.fromTo(sectionRef.current.querySelectorAll(".section-title-reveal"),
      { opacity: 0, y: 30, filter: "blur(6px)" },
      {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power4.out", stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%" }
      }
    );

    // Blocks reveal
    const studies = sectionRef.current.querySelectorAll(".case-block");
    studies.forEach((block) => {
      gsap.fromTo(block.querySelectorAll(".case-reveal"),
        { opacity: 0, y: 20, filter: "blur(6px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.1, ease: "power4.out",
          scrollTrigger: { trigger: block, start: "top 55%" },
        }
      );
    });
  }, []);

  return (
    <section id="case-studies" ref={sectionRef} className="section relative">
      {/* Environmental depth background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at right, rgba(139,108,240,0.03) 0%, transparent 60%)" }} />

      <div className="container relative z-10">

        <div className="mb-16 flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="t-label tracking-widest uppercase opacity-60 mb-5 section-title-reveal">System Showcases</div>
          <h2 className="t-h2 section-title-reveal text-balance font-serif" style={{ fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)", lineHeight: 1.05 }}>
            Intelligence infrastructure<br />in production.
          </h2>
        </div>

        <div className="flex flex-col gap-24">
          {STUDIES.map((study, idx) => (
            <div key={study.id} className="case-block grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

              {/* Architecture Diagram */}
              <div className={`lg:col-span-7 ${idx % 2 === 1 ? "lg:order-last" : ""} case-reveal`}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl"
                  style={{ background: "#030408", border: "1px solid rgba(255,255,255,0.08)", aspectRatio: "500/360" }}>
                  {study.diagram}
                  {/* Bottom label */}
                  <div className="absolute bottom-0 left-0 right-0 px-8 py-5 border-t backdrop-blur-md"
                    style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(3,4,8,0.6)" }}>
                    <span className="t-mono text-[11px] uppercase tracking-widest font-medium" style={{ color: "var(--accent)" }}>{study.architecture}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`lg:col-span-5 ${idx % 2 === 1 ? "lg:order-first" : ""} flex flex-col gap-8`}>

                <div className="case-reveal">
                  <div className="t-label mb-4 opacity-50 uppercase tracking-widest">{study.industry}</div>
                  <h3 className="t-h3 mb-6 font-serif" style={{ fontSize: "2rem", lineHeight: 1.1 }}>{study.client}</h3>
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                    <div className="t-label mb-3 opacity-60">Challenge</div>
                    <p className="t-body opacity-80" style={{ fontSize: "1rem", lineHeight: 1.6 }}>{study.challenge}</p>
                  </div>
                </div>

                <div className="case-reveal">
                  <div className="t-label mb-5 opacity-70">Architecture Implementation</div>
                  <div className="flex flex-col gap-3">
                    {study.technical.map((tech, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <span className="t-mono opacity-40 text-xs mt-1">{(i+1).toString().padStart(2, '0')}</span>
                        <p className="t-body opacity-70 text-[0.95rem] leading-relaxed">{tech}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="case-reveal pt-6 border-t border-white/5">
                  <div className="t-label mb-5" style={{ color: "var(--success)" }}>Operational Impact</div>
                  <div className="grid grid-cols-1 gap-4">
                    {study.impact.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-emerald-400/[0.03] border border-emerald-400/10">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <span className="t-body font-medium text-[0.95rem] text-emerald-50/90">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
