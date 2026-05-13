"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Lenis Smooth Scroll — cinematic easing
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.8,
    });

    // Single RAF loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP + ScrollTrigger init
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        // Sync Lenis with GSAP ScrollTrigger — critical for no-jitter
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // ── DATA-PARALLAX: per-element depth parallax ─────────────────
        const parallaxEls = document.querySelectorAll("[data-parallax]");
        parallaxEls.forEach((el) => {
          const speed = parseFloat((el as HTMLElement).getAttribute("data-parallax") || "0.05");
          gsap.to(el, {
            y: () => -(window.innerHeight * speed * 1.5),
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5, // higher = smoother, less jitter
              invalidateOnRefresh: true,
            },
          });
        });

        // ── CINEMATIC SECTION DEPTH PARALLAX ─────────────────────────
        // Each section drifts upward at a slightly different rate,
        // creating a layered, heavy "sliding panes of glass" effect.
        // We use translate3d for GPU compositing — zero layout thrash.
        const sections = document.querySelectorAll("main > section");
        sections.forEach((sec, i) => {
          // Skip the Hero — it's the anchor
          if (i === 0) return;

          const el = sec as HTMLElement;
          // Ensure GPU compositing context
          el.style.willChange = "transform";
          el.style.backfaceVisibility = "hidden";
          el.style.position = "relative";
          el.style.zIndex = `${i + 5}`;

          // Amount the section slides up as its neighbour scrolls in.
          // Smaller values = more subtle. 0.06 = cinematic without aggression.
          const depth = 0.06 * i;

          gsap.fromTo(
            el,
            { y: window.innerHeight * depth },
            {
              y: -(window.innerHeight * depth * 0.3),
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 2.5, // heavier, smoother
                invalidateOnRefresh: true,
              },
            }
          );
        });

        ScrollTrigger.refresh();
      });
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
