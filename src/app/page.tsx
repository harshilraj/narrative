"use client";
import { useState } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Capabilities from "@/components/Capabilities";
import LiveOperations from "@/components/LiveOperations";
import Process from "@/components/Process";
import CaseStudies from "@/components/CaseStudies";
import EnterpriseTrust from "@/components/EnterpriseTrust";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import GlobalEnvironment from "@/components/GlobalEnvironment";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <SmoothScroll>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <GlobalEnvironment />
      <main className={`site-shell relative z-10 ${loading ? "" : "site-shell-ready"}`} style={{ background: "transparent" }}>
        <Nav />
        <Hero initialized={!loading} />
        <Capabilities />
        <LiveOperations />
        <Process />
        <EnterpriseTrust />
        <CaseStudies />
        <FinalCTA />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
