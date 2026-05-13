import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Narrative AI | Production AI Systems for Modern Operations",
  description: "Narrative AI designs workflow routing, AI automation, and cloud systems that turn fragmented operations into reliable production execution.",
  keywords: "AI systems, workflow automation, cloud architecture, AWS, GCP, LLM orchestration, RAG pipeline, AI infrastructure",
  openGraph: {
    title: "Narrative AI | Production AI Systems",
    description: "Build AI systems that route work, automate decisions, and keep operations visible.",
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
