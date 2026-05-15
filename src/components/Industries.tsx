"use client";

const INDUSTRIES = [
  "Operations Teams",
  "Logistics",
  "Finance",
  "Healthcare",
  "SaaS",
  "Enterprise Support",
  "Internal Ops",
  "Multi-system Workflows",
];

export default function Industries() {
  return (
    <section className="section relative overflow-hidden">
      <div className="container relative z-10">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-4">WHO THIS IS FOR</div>
            <h2 className="section-title text-balance">Built for operationally complex businesses.</h2>
          </div>
          <p className="t-body max-w-md">Narrative AI fits organizations where work crosses teams, cloud systems, approval paths, and high-volume operational decisions.</p>
        </div>

        <div className="industry-grid">
          {INDUSTRIES.map((industry) => (
            <article key={industry} className="industry-card">
              <span>{industry}</span>
              <div className="h-px flex-1 bg-white/10" />
              <strong>Operational fit</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
