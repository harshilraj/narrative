import React from "react";

export default function Footer() {
  const [year, setYear] = React.useState("");
  
  React.useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  const links: Record<string, string[]> = {
    Systems: ["Workflow Routing", "Automation", "Cloud Architecture", "Monitoring"],
    Company: ["About", "Case Studies", "Blog", "Careers"],
    Legal: ["Privacy Policy", "Terms of Service", "SOC 2"],
  };

  return (
    <footer className="relative" style={{ background: "rgba(6,8,15,0.8)", paddingTop: "4.5rem", paddingBottom: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="container relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 md:mb-14">

          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="t-h3 mb-5 font-serif tracking-wide" style={{ fontSize: "1.2rem" }}>Narrative AI</div>
            <p className="t-body mb-8 opacity-60" style={{ lineHeight: 1.7, maxWidth: "280px", fontSize: "0.95rem" }}>
              Production AI systems for teams that need clear routing, accountable automation, and reliable deployment.
            </p>
            <div className="flex items-center gap-3">
              <div className="status-dot w-2 h-2 rounded-full" style={{ boxShadow: "0 0 8px var(--success)" }} />
              <span className="t-mono uppercase tracking-widest opacity-80" style={{ fontSize: "10px" }}>All systems nominal</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group} className="lg:col-span-2">
              <div className="t-label tracking-widest uppercase opacity-50 mb-6">{group}</div>
              <div className="flex flex-col gap-4">
                {items.map(item => (
                  <a key={item} href="#" className="t-small nav-link opacity-70 hover:opacity-100 transition-opacity" style={{ fontSize: "0.9rem" }}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <p className="t-mono opacity-40" style={{ fontSize: "10px" }}>© {year || "2026"} Narrative AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="t-mono opacity-30 uppercase tracking-widest" style={{ fontSize: "10px" }}>SYS_OPERATIONAL</span>
            <span className="t-mono opacity-20">{"//"}</span>
            <span className="t-mono opacity-30 uppercase tracking-widest" style={{ fontSize: "10px" }}>US-EAST-1 / EU-WEST-1</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
