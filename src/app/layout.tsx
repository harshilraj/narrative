import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Narrative AI — Intelligent Infrastructure for Modern Operations",
  description: "Narrative AI designs orchestration layers, AI workflows, and cloud systems that eliminate manual complexity and help businesses operate autonomously.",
  keywords: "AI systems, workflow automation, cloud architecture, AWS, GCP, LLM orchestration, RAG pipeline, AI infrastructure",
  openGraph: {
    title: "Narrative AI — Intelligent Infrastructure",
    description: "Build systems that think, route, and operate autonomously.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
