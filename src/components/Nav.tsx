"use client";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(6,8,15,0.75)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        padding: scrolled ? "14px 0" : "22px 0",
      }}
    >
      <div className="container flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-4">
          <span className="t-h3 font-serif tracking-wide" style={{ fontSize: "1.15rem", letterSpacing: "-0.01em" }}>
            Narrative AI
          </span>
          {/* System status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full"
            style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)" }}>
            <div className="status-dot w-2 h-2 rounded-full" style={{ boxShadow: "0 0 8px var(--success)" }} />
            <span className="t-label uppercase tracking-widest" style={{ fontSize: "10px", color: "rgba(52,211,153,0.8)" }}>
              Systems Operational
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Infrastructure", "Process", "Results", "Case Studies"].map((l) => (
            <a key={l}
              href={`#${l.toLowerCase().replace(" ", "-")}`}
              className="t-small nav-link uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity"
              style={{ fontSize: "10px" }}
            >
              {l}
            </a>
          ))}
        </div>

        <a href="#contact" className="btn-primary hidden md:inline-flex" style={{ padding: "10px 24px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Get Started
        </a>

      </div>
    </nav>
  );
}
