import type { Metadata } from "next";
import Landing from "@/components/Landing";

export const metadata: Metadata = {
  title: "POSEIDON AI | Deep Ocean Exploration Experience",
  description: "Descend into 11,000m deep sea oceanography powered by Google Gemini AI.",
  keywords: ["ocean exploration", "deep sea", "sonar telemetry", "poseidon expedition", "cinematic web app"],
  authors: [{ name: "POSEIDON AI Expedition Team" }],
};

export default function Home() {
  return <Landing />;
}
