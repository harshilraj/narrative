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
        background: scrolled ? "rgba(5,10,10,0.62)" : "rgba(5,10,10,0.08)",
        backdropFilter: "blur(14px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        padding: scrolled ? "14px 0" : "22px 0",
      }}
    >
      <div className="container flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-4">
          <span className="t-h3 tracking-wide" style={{ fontSize: "1.15rem", letterSpacing: 0 }}>
            Narrative AI
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Infrastructure", "Process", "Results", "Case Studies"].map((l) => (
            <a key={l}
              href={`#${l.toLowerCase().replace(" ", "-")}`}
              className="t-small nav-link uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity"
              style={{ fontSize: "10px", fontFamily: "'DM Mono', monospace" }}
            >
              {l}
            </a>
          ))}
        </div>

        <a href="#contact" className="btn-primary hidden md:inline-flex" style={{ padding: "10px 24px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'DM Mono', monospace" }}>
          GET STARTED
        </a>

      </div>
    </nav>
  );
}
