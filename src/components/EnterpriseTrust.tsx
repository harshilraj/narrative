"use client";

const MODULES = [
  {
    label: "Cloud-Native Infrastructure",
    copy: "Deployed across AWS, Google Cloud, and scalable enterprise infrastructure environments.",
    meta: ["AWS", "GCP", "Azure"],
  },
  {
    label: "Observable AI Execution",
    copy: "Every action, decision, and workflow transition remains traceable, reviewable, and controllable.",
    meta: ["Audit", "Review", "Control"],
  },
  {
    label: "Long-Term Systems Evolution",
    copy: "Operational systems evolve continuously as workflows, scale, and infrastructure complexity increase.",
    meta: ["Scale", "Adapt", "Operate"],
  },
];

export default function EnterpriseTrust() {
  return (
    <section id="enterprise" className="section enterprise-confidence-section relative overflow-hidden">
      <div className="container relative z-10">
        <div className="mb-12 max-w-3xl">
          <div className="section-eyebrow mb-4">WHY ENTERPRISE TEAMS CHOOSE NARRATIVE</div>
          <h2 className="section-title text-balance">Enterprise infrastructure confidence, not automation theater.</h2>
        </div>

        <div className="enterprise-confidence">
          <article className="enterprise-feature">
            <div className="enterprise-feature-copy">
              <div className="section-eyebrow mb-5">PRODUCTION RELIABILITY</div>
              <h3>Built for operational environments where failure is expensive.</h3>
              <p>Narrative AI systems are designed for production reliability, audit visibility, cloud-native deployment, and controlled autonomous execution - not prototype demos or isolated automations.</p>
              <div className="enterprise-feature-points">
                <span>Governed autonomy</span>
                <span>Cloud-native delivery</span>
                <span>Observable operations</span>
              </div>
            </div>

            <div className="enterprise-telemetry" aria-hidden="true">
              <div className="telemetry-row">
                <span>execution state</span>
                <strong>nominal</strong>
              </div>
              <div className="telemetry-row">
                <span>cloud routing</span>
                <strong>multi-region</strong>
              </div>
              <div className="telemetry-graph">
                {Array.from({ length: 28 }, (_, index) => (
                  <i key={index} style={{ height: `${24 + ((index * 17) % 52)}%` }} />
                ))}
              </div>
              <div className="telemetry-grid">
                <span>AWS</span>
                <span>GCP</span>
                <span>Azure</span>
                <span>Audit</span>
              </div>
            </div>
          </article>

          <div className="enterprise-modules">
            {MODULES.map((module, index) => (
              <article key={module.label} className="enterprise-module">
                <div className="module-index">{String(index + 1).padStart(2, "0")}</div>
                <h3>{module.label}</h3>
                <p>{module.copy}</p>
                <div className="module-meta">
                  {module.meta.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
