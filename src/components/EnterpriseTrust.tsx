"use client";

const TRUST = [
  {
    title: "Production-ready systems",
    copy: "Built for live operational environments, not prototype demos or disconnected experiments.",
  },
  {
    title: "Cloud-native infrastructure",
    copy: "Designed for AWS, Google Cloud, Azure, and scalable deployment environments.",
  },
  {
    title: "Human + AI oversight",
    copy: "Critical workflows remain observable, traceable, and controllable at every step.",
  },
  {
    title: "Long-term systems partner",
    copy: "We evolve infrastructure continuously as operations, teams, and system complexity scale.",
  },
];

export default function EnterpriseTrust() {
  return (
    <section id="enterprise" className="section relative overflow-hidden">
      <div className="container relative z-10">
        <div className="mb-12 max-w-3xl">
          <div className="section-eyebrow mb-4">WHY ENTERPRISE TEAMS CHOOSE NARRATIVE</div>
          <h2 className="section-title text-balance">Reliability for the work that cannot stall.</h2>
        </div>

        <div className="trust-grid">
          {TRUST.map((item, index) => (
            <article key={item.title} className="trust-card">
              <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</div>
              <h3 className="mt-8 font-serif text-[28px] leading-none text-white">{item.title}</h3>
              <p className="t-body mt-5">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
