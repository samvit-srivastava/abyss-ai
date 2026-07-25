import type { Metadata } from "next";
import Landing from "@/components/Landing";

export const metadata: Metadata = {
  title: "ABYSS AI | Deep Ocean Exploration Experience",
  description: "Descend through the ocean's layers, uncover forgotten mysteries, and let POSEIDON guide your expedition. An immersive cinematic deep-ocean exploration experience.",
  keywords: ["ocean exploration", "deep sea", "sonar telemetry", "poseidon expedition", "cinematic web app"],
  authors: [{ name: "Abyss AI Expedition Team" }],
};

export default function Home() {
  return <Landing />;
}
