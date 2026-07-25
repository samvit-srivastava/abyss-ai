"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Send, Sparkles, AlertCircle, Bot, User, ShieldCheck } from "lucide-react";
import { Discovery } from "@/data/discoveries";
import { oceanObjects } from "@/data/ocean";
import { OCEAN_CREATURES_50 } from "@/data/oceanCreatures";
import { calculatePressureFromDepth, calculateTemperatureFromDepth } from "@/lib/oceanUtils";

interface DiscoveryPanelProps {
  discovery: Discovery;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function DiscoveryPanel({ discovery, onClose }: DiscoveryPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const backendObject = oceanObjects.find(
    (o) => o.id === discovery.id || o.name.toLowerCase().includes(discovery.name.toLowerCase())
  );

  const creatureMatch = OCEAN_CREATURES_50.find(
    (c) => c.id === discovery.id || c.name.toLowerCase().includes(discovery.name.toLowerCase())
  );

  const imageFilename = creatureMatch?.imageFilename || `${discovery.id}.jpg`;

  const pressure = calculatePressureFromDepth(discovery.targetDepth);
  const temperature = calculateTemperatureFromDepth(discovery.targetDepth);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputQuestion("");
    setIsLoading(true);
    setErrorMessage(null);

    const targetObjectId = backendObject ? backendObject.id : discovery.id;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectId: targetObjectId,
          question: q,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to reach POSEIDON telemetry.");
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setErrorMessage(err.message || "An unexpected communication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = backendObject?.sampleQuestions || [
    `How does ${discovery.name} adapt to extreme pressure?`,
    `What role does this play in the deep-sea ecosystem?`,
    `Could a human submersible safely explore near here?`,
  ];

  const facts = backendObject?.interestingFacts || [
    `Target depth recorded at ${discovery.targetDepth} meters.`,
    `Taxonomic classification: ${discovery.scientificName}.`,
    `Threat classification: Nominal / Research Priority.`,
  ];

  return (
    <motion.aside
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className="fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-[#010912]/95 backdrop-blur-2xl border-l border-white/10 text-white flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.9)]"
    >
      {/* Hero Specimen Image Header */}
      <div className="relative w-full h-48 md:h-56 bg-black overflow-hidden border-b border-white/10 shrink-0">
        <img
          src={`/images/${imageFilename}`}
          alt={discovery.name}
          className="w-full h-full object-cover opacity-85"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010912] via-[#010912]/40 to-transparent" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/60 hover:bg-black/80 border border-white/20 transition-all focus:outline-none"
          aria-label="Close discovery panel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Specimen Header Title Overlay */}
        <div className="absolute bottom-4 left-6 right-6 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sonar-cyan animate-ping" />
            <span className="text-[8.5px] tracking-[0.3em] font-mono text-sonar-cyan uppercase font-semibold">
              TELEMETRY INTEL // [{discovery.rarity}]
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight drop-shadow-md">
            {discovery.name}
          </h2>
          <span className="text-xs font-mono text-white/50 italic">
            {discovery.scientificName}
          </span>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 font-mono text-xs">
        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-3 gap-2 border border-white/10 bg-black/60 p-3.5 text-center">
          <div className="flex flex-col">
            <span className="text-[7.5px] text-white/30 uppercase tracking-widest">DEPTH</span>
            <span className="text-sm font-semibold text-white mt-0.5">{discovery.targetDepth}m</span>
          </div>
          <div className="flex flex-col border-l border-r border-white/10 px-2">
            <span className="text-[7.5px] text-white/30 uppercase tracking-widest">PRESSURE</span>
            <span className="text-sm font-semibold text-sonar-cyan mt-0.5">{pressure} ATM</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7.5px] text-white/30 uppercase tracking-widest">TEMP</span>
            <span className="text-sm font-semibold text-white/80 mt-0.5">{temperature.toFixed(1)}°C</span>
          </div>
        </div>

        {/* Description & Analysis */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <span className="text-[8.5px] tracking-[0.25em] text-white/40 uppercase">
              FIELD OBSERVATIONS
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-sonar-cyan/70" />
          </div>
          <p className="font-sans text-xs md:text-sm font-light text-white/80 leading-relaxed bg-white/[0.03] p-4 border-l-2 border-sonar-cyan/80">
            {discovery.description}
          </p>
        </div>

        {/* Key Facts */}
        <div className="flex flex-col gap-2">
          <span className="text-[8.5px] tracking-[0.25em] text-white/40 uppercase">
            SPECIMEN DATA
          </span>
          <ul className="flex flex-col gap-2">
            {facts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs font-sans text-white/70 bg-black/40 p-3 border border-white/5">
                <span className="text-sonar-cyan font-mono text-[10px] font-bold mt-0.5">0{idx + 1}.</span>
                <span className="leading-relaxed">{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Questions */}
        <div className="flex flex-col gap-2">
          <span className="text-[8.5px] tracking-[0.25em] text-white/40 uppercase">
            SUGGESTED INTEL QUERIES
          </span>
          <div className="flex flex-col gap-2">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="text-left text-xs font-sans bg-white/[0.03] hover:bg-sonar-cyan/10 border border-white/10 hover:border-sonar-cyan/50 text-white/80 hover:text-sonar-cyan p-3 transition-all disabled:opacity-50"
              >
                &quot;{q}&quot;
              </button>
            ))}
          </div>
        </div>

        {/* AI Thread */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-4 mt-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-sonar-cyan" />
            <span className="text-[9px] tracking-[0.25em] text-white/60 uppercase font-medium">
              POSEIDON EXPEDITION COMM
            </span>
          </div>

          {messages.length === 0 && !isLoading && (
            <div className="p-4 border border-white/10 text-center text-xs text-white/40 font-sans">
              Ask POSEIDON anything about <span className="text-sonar-cyan">{discovery.name}</span>.
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 text-xs md:text-sm font-sans ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-white/30">
                {msg.sender === "user" ? (
                  <>
                    <span>SUB COMMANDER</span>
                    <User className="w-3 h-3 text-white/50" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-sonar-cyan" />
                    <span className="text-sonar-cyan">POSEIDON GUIDE</span>
                  </>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`p-3.5 leading-relaxed max-w-[92%] ${
                  msg.sender === "user"
                    ? "bg-sonar-cyan/10 text-white border border-sonar-cyan/30"
                    : "bg-black/60 text-white/90 border-l-2 border-sonar-cyan border-y border-r border-white/10"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-black/60 border border-sonar-cyan/30 text-sonar-cyan text-xs font-mono">
              <Bot className="w-4 h-4 animate-pulse" />
              <span>POSEIDON analyzing telemetry...</span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Input Form Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-white/10 bg-black/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={`Ask POSEIDON about ${discovery.name}...`}
          disabled={isLoading}
          className="flex-1 bg-black/60 border border-white/15 focus:border-sonar-cyan/70 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuestion.trim()}
          className="px-4 py-2.5 bg-sonar-cyan text-black font-mono font-semibold text-xs flex items-center gap-2 hover:bg-sonar-cyan/80 transition-colors disabled:opacity-40"
        >
          <span>SEND</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </motion.aside>
  );
}
