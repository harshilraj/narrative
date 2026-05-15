"use client";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
      style={{
        background: scrolled ? "rgba(2, 1, 15, 0.86)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        transition: "all 0.4s ease",
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
          {[
            { label: "HOW IT WORKS", href: "#process" },
            { label: "DEPLOYMENT", href: "#results" },
            { label: "ENTERPRISE", href: "#enterprise" },
            { label: "CASE STUDIES", href: "#case-studies" },
          ].map((link, index) => (
            <a key={`${link.label}-${index}`}
              href={link.href}
              className="t-small nav-link uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity"
              style={{ fontSize: "10px", fontFamily: "'DM Mono', monospace" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="btn-ghost hidden md:inline-flex"
          style={{
            background: scrolled ? "rgba(255,255,255,0.95)" : "#ffffff",
            boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : undefined,
          }}
        >
          GET STARTED
        </a>

      </div>
    </nav>
  );
}
