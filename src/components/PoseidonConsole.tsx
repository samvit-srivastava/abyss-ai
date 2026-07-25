"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Cpu, Send, AlertTriangle, User, Loader2 } from "lucide-react";
import { Discovery } from "@/data/discoveries";

interface Message {
  role: "user" | "model" | "system";
  content: string;
  timestamp: string;
}

interface PoseidonConsoleProps {
  discovery: Discovery;
  depth: number;
  onClose: () => void;
}

// Diagnostic steps for typewriter boot experience
const BOOT_STEPS = [
  "POSEIDON OS v1.0 // MAIN SYSTEM",
  "INITIALIZING MAIN COGNITIVE GRID...",
  "Connecting Sonar telemetry... ✓",
  "Connecting hydrostatic sensors... ✓",
  "Loading Marine specimen database... ✓",
  "Synchronizing environmental telemetries... ✓",
  "Gemini Neural Core Online... ✓",
  "POSEIDON COGNITIVE LINK READY."
];

const LOADING_MESSAGES = [
  "Analyzing marine biology...",
  "Scanning environmental conditions...",
  "Accessing expedition archives...",
  "Computing pressure models...",
  "Consulting oceanographic database..."
];

export default function PoseidonConsole({ discovery, depth, onClose }: PoseidonConsoleProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // States
  const [booting, setBooting] = useState(true);
  const [bootTextIndex, setBootTextIndex] = useState(0);
  const [bootLines, setBootLines] = useState<string[]>([]);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  const [latitude, setLatitude] = useState(11.3492);
  const [longitude, setLongitude] = useState(142.1996);

  // Calculations for current location telemetry
  const pressure = Math.round(1 + depth / 10);
  let temp = 20.0;
  if (depth < 200) {
    temp = 20.0 - (depth / 200) * 4.0;
  } else if (depth < 1000) {
    temp = 16.0 - ((depth - 200) / 800) * 11.0;
  } else if (depth < 4000) {
    temp = 5.0 - ((depth - 1000) / 3000) * 2.5;
  } else if (depth < 6000) {
    temp = 2.5 - ((depth - 4000) / 2000) * 1.1;
  } else {
    temp = 1.4 - ((depth - 6000) / 5000) * 0.3;
  }

  let zoneName = "Surface";
  if (depth === 0) zoneName = "Surface";
  else if (depth <= 200) zoneName = "Sunlight Zone";
  else if (depth <= 1000) zoneName = "Twilight Zone";
  else if (depth <= 4000) zoneName = "Midnight Zone";
  else if (depth <= 6000) zoneName = "Abyssal Zone";
  else zoneName = "Hadal Zone";

  // --- BOOT DIAGNOSTIC SEQUENCE ---
  useEffect(() => {
    if (bootTextIndex < BOOT_STEPS.length) {
      const delay = bootTextIndex === 0 ? 100 : bootTextIndex === 1 ? 300 : 250;
      const timer = setTimeout(() => {
        setBootLines((prev) => [...prev, BOOT_STEPS[bootTextIndex]]);
        setBootTextIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Boot completed: initialize chat panel
      const timer = setTimeout(() => {
        setBooting(false);
        // Seed first POSEIDON greeting
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setMessages([
          {
            role: "model",
            content: `POSEIDON neural mainframe online. Synchronized at depth ${depth.toLocaleString()}m inside the ${zoneName.toUpperCase()}. Accessing telemetry for anomaly: '${discovery.name.toUpperCase()}'. I am ready to assist your expedition. What are your commands?`,
            timestamp: timeStr,
          }
        ]);
        
        // Auto-focus input on boot complete
        setTimeout(() => inputRef.current?.focus(), 100);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [bootTextIndex, depth, zoneName, discovery.name]);

  // --- COMPANION ESCAPE & FOCUS TRAPPING ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      
      // Trap focus
      if (e.key === "Tab" && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
          'button:not([disabled]), input, [tabindex="0"]'
        );
        if (focusableElements.length === 0) return;
        
        const first = focusableElements[0] as HTMLElement;
        const last = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    // Prevent document scroll propagation under modal
    document.documentElement.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = "";
    };
  }, [onClose]);

  // --- TELEMETRY COORDINATES FLUCTUATION ---
  useEffect(() => {
    const coordInterval = setInterval(() => {
      setLatitude((prev) => prev + (Math.random() - 0.5) * 0.0001);
      setLongitude((prev) => prev + (Math.random() - 0.5) * 0.0001);
    }, 1500);
    return () => clearInterval(coordInterval);
  }, []);

  // --- ROTATING LOADING MESSAGES FOR THINKING STATE ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isThinking) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 950);
    }
    return () => clearInterval(interval);
  }, [isThinking]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // --- SUBMIT COMPANION CONVERSATION ROUTE ---
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMessageText = text.trim();
    setInputValue("");
    setErrorStatus(null);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    
    // 1. Append User Message
    const updatedMessages = [
      ...messages,
      { role: "user" as const, content: userMessageText, timestamp: timeStr }
    ];
    setMessages(updatedMessages);
    setIsThinking(true);

    try {
      // 2. Fetch Gemini Server endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          depth,
          zone: zoneName,
          pressure,
          temperature: parseFloat(temp.toFixed(1)),
          discoveryName: discovery.name,
          discoveryScientificName: discovery.scientificName,
          discoveryRarity: discovery.rarity,
          discoveryDescription: discovery.description,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "POSEIDON: Network link dropped.");
      }

      // 3. Append POSEIDON Response
      const respNow = new Date();
      const respTimeStr = `${String(respNow.getHours()).padStart(2, "0")}:${String(respNow.getMinutes()).padStart(2, "0")}`;
      setMessages((prev) => [
        ...prev,
        { role: "model" as const, content: data.text, timestamp: respTimeStr }
      ]);
    } catch (err) {
      console.error(err);
      setErrorStatus("POSEIDON: Connection to expedition systems temporarily unavailable. Please try again.");
    } finally {
      setIsThinking(false);
    }
  };

  // Trigger suggestions dynamically based on symbol type
  const getDynamicSuggestions = (symbol: string) => {
    switch (symbol) {
      case "amphora":
        return ["How did this amphora end up here?", "What did it hold?", "Can we extract its contents?"];
      case "coral":
        return ["Why does this coral glow?", "How does it grow without sunlight?", "What species live in it?"];
      case "anchor":
        return ["What type of ship did this belong to?", "How old is this metal?", "How has pressure affected it?"];
      case "drone":
        return ["Who launched this drone?", "Can we recover its logs?", "What was its mission?"];
      case "squid":
        return ["How fast can this squid swim?", "Why is its skin shimmering?", "What are its predators?"];
      case "angler":
        return ["Why does its light glow?", "How does it find prey?", "Could humans survive its jaws?"];
      case "skeleton":
        return ["What whale species is this?", "How long has it been here?", "What organisms feed on the bones?"];
      case "titanic":
        return ["What part of the ship is this?", "Why is it rusting so fast?", "Can we salvage this plate?"];
      case "smoker":
        return ["How hot is the venting water?", "What elements are in the smoke?", "How does life survive here?"];
      case "probe":
        return ["What data was Nadir-I gathering?", "Is it still transmitting?", "Can we override its mainframe?"];
      case "egg":
        return ["What creature lies inside?", "Why does it respond to sonar?", "How thick is its shell?"];
      case "fossil":
        return ["How old is this fossil?", "What did the ammonite eat?", "Was this trench once at the surface?"];
      default:
        return ["Why does it survive here?", "Can humans reach this depth?", "What is its composition?"];
    }
  };

  const suggestions = getDynamicSuggestions(discovery.symbol);

  // Render illustration SVG copy inside Right Telemetry Panel
  const renderTelemetryIllustration = () => {
    const styleString = "w-20 h-20 text-sonar-cyan opacity-80 filter drop-shadow-[0_0_8px_rgba(0,240,255,0.3)] animate-pulse";
    switch (discovery.symbol) {
      case "amphora":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={styleString}>
            <path d="M40,25 C40,18 43,15 50,15 C57,15 60,18 60,25 Z M35,25 L65,25 M42,25 L38,35 C33,48 30,55 30,68 C30,82 38,88 50,88 C62,88 70,82 70,68 C70,55 67,48 62,35 L58,25" />
          </svg>
        );
      case "coral":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={styleString}>
            <path d="M50,90 L50,60 M50,70 C40,65 38,55 35,50 M50,60 C60,55 62,45 65,40 M65,40 C62,40 58,35 55,35 M50,75 C40,73 30,65 30,58" />
          </svg>
        );
      case "anchor":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={styleString}>
            <circle cx="50" cy="22" r="6" />
            <path d="M50,28 L50,72 M35,38 L65,38 M25,58 C30,75 70,75 75,58 M22,58 L28,58 M72,58 L78,58" />
          </svg>
        );
      case "drone":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={styleString}>
            <rect x="25" y="35" width="50" height="30" rx="15" />
            <circle cx="40" cy="50" r="4" fill="currentColor" />
            <path d="M15,50 L25,50 M75,50 L85,50 M15,42 L15,58 M85,42 L85,58 M50,35 L50,22" />
          </svg>
        );
      case "squid":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={styleString}>
            <path d="M50,15 C40,25 35,45 42,60 Q50,68 58,60 C65,45 60,25 50,15 Z M42,65 Q35,80 40,92 M46,65 Q45,82 48,94 M54,65 Q55,82 52,94 M58,65 Q65,80 60,92" />
          </svg>
        );
      case "angler":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={styleString}>
            <path d="M15,50 C15,25 70,20 82,45 C85,48 80,62 75,66 C60,75 20,70 15,50 Z M45,34 C40,20 25,20 28,32" />
            <circle cx="28" cy="32" r="2" fill="currentColor" />
          </svg>
        );
      case "skeleton":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={styleString}>
            <path d="M20,50 L80,50 M30,50 Q30,30 40,30 M30,50 Q30,70 40,70 M45,50 Q45,28 55,28 M45,50 Q45,72 55,72" />
          </svg>
        );
      case "titanic":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={styleString}>
            <rect x="20" y="25" width="60" height="50" rx="4" />
            <circle cx="50" cy="50" r="12" />
            <path d="M22,78 L22,86 M28,78 L28,82" />
          </svg>
        );
      case "smoker":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={styleString}>
            <path d="M30,85 L40,45 L48,45 L42,85 Z M55,85 L65,35 L75,35 L67,85 Z" />
            <path d="M65,30 Q60,15 67,0" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        );
      case "probe":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={styleString}>
            <path d="M30,68 L70,68 L60,45 L40,45 Z M50,45 L50,22" />
            <circle cx="50" cy="20" r="1.5" />
          </svg>
        );
      case "egg":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={styleString}>
            <ellipse cx="50" cy="50" rx="20" ry="28" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="5" fill="currentColor" />
          </svg>
        );
      case "fossil":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={styleString}>
            <path d="M50,50 C50,50 48,38 35,42 C22,46 25,62 38,68 C51,74 72,62 75,45" />
          </svg>
        );
      default:
        return <Compass className="w-16 h-16 text-sonar-cyan" />;
    }
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="console-header"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col md:flex-row bg-[#010910]/98 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.9)] p-4 md:p-6 overflow-hidden pointer-events-auto font-mono select-none"
    >
      
      {/* BACKGROUND DECORATIVE GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* CRT SCANLINE AND PHOSPHOR GLASS EFFECT */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.18)_50%)] bg-[size:100%_3px] pointer-events-none opacity-25 z-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,3,10,0.45)_100%)] pointer-events-none z-40" />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. CINEMATIC BOOT DIAGNOSTIC TERMINAL SCREEN */}
      <AnimatePresence>
        {booting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 bg-[#00050a] z-50 flex flex-col p-8 justify-between text-sonar-cyan pointer-events-auto"
          >
            {/* Diagnostic Logs */}
            <div className="flex flex-col gap-2.5 max-w-2xl text-left">
              {bootLines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] tracking-widest leading-relaxed">
                  {idx > 1 && idx < 7 ? (
                    <span className="text-white/40">&gt;&gt;</span>
                  ) : null}
                  <span>{line}</span>
                </div>
              ))}
              
              {/* Typewriter active cursor */}
              <div className="flex items-center gap-2 mt-2">
                <span className="h-3 w-1.5 bg-sonar-cyan animate-pulse"></span>
              </div>
            </div>

            {/* Bottom OS Tagline */}
            <div className="flex items-center justify-between border-t border-sonar-cyan/15 pt-4 text-[9px] tracking-[0.25em] opacity-40 uppercase font-semibold">
              <span>EXPEDITION_MAIN_FRAME: ACTIVE</span>
              <span>CALIBRATION PROTOCOL // v1.0.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. CORE CONSOLE INTERFACE DISPLAY */}
      
      {/* LEFT PANEL: CONVERSATION PANEL */}
      <div className="w-full md:w-[62%] flex flex-col justify-between h-[65vh] md:h-full pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-white/10 pb-4">
        
        {/* Status header banner */}
        <header className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-sonar-cyan animate-pulse" />
            <div className="flex flex-col text-left">
              <span id="console-header" className="text-xs font-bold text-white tracking-widest uppercase">
                POSEIDON AI Mainframe
              </span>
              <span className="text-[8px] text-sonar-cyan/60 tracking-wider">
                NEURAL EXPLORATION CO-PILOT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Blinking State Label */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isThinking ? 'bg-yellow-500' : 'bg-sonar-cyan'}`} />
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isThinking ? 'bg-yellow-500' : 'bg-sonar-cyan'}`} />
              </span>
              <span className={`text-[8.5px] uppercase font-semibold tracking-widest ${isThinking ? 'text-yellow-500 animate-pulse' : 'text-sonar-cyan'}`}>
                {isThinking ? "ANALYZING" : "STANDBY"}
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-[9px] border border-white/15 bg-white/5 hover:border-sonar-cyan/50 hover:bg-sonar-cyan/10 text-white/50 hover:text-white transition-all duration-300 pointer-events-auto cursor-none uppercase"
            >
              Close
            </button>
          </div>
        </header>

        {/* Conversation Logs */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 text-left select-text custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`max-w-[85%] flex flex-col gap-1 ${
                m.role === "user" ? "self-end items-end" : "self-start items-start"
              }`}
            >
              {/* Message Header Tag */}
              <div className="flex items-center gap-1.5 text-[8px] text-white/30 tracking-widest uppercase">
                {m.role === "model" ? (
                  <>
                    <Compass className="w-2.5 h-2.5 text-sonar-cyan animate-spin-[spin_10s_linear_infinite]" />
                    <span className="text-sonar-cyan/70 font-bold">POSEIDON OS</span>
                  </>
                ) : (
                  <>
                    <User className="w-2.5 h-2.5 text-white/40" />
                    <span>Explorer</span>
                  </>
                )}
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>

              {/* Message Content Bubble */}
              <div
                className={`text-[10.5px] md:text-[11px] leading-relaxed tracking-wider py-3 px-4 shadow-sm border ${
                  m.role === "model"
                    ? "border-l-2 border-l-sonar-cyan border-white/5 bg-white/[0.02] text-slate-100 shadow-[0_0_15px_rgba(0,240,255,0.015)]"
                    : "border-white/10 bg-white/[0.05] text-slate-200"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {/* Holographic Waveform / Thinking Loader */}
          {isThinking && (
            <div className="self-start flex flex-col gap-1.5 max-w-[85%]">
              <div className="flex items-center gap-1.5 text-[8px] text-sonar-cyan/70 tracking-widest uppercase">
                <Loader2 className="w-3 h-3 text-sonar-cyan animate-spin" />
                <span className="font-bold">{LOADING_MESSAGES[loadingTextIndex]}</span>
              </div>
              
              {/* Concentric waveform lines */}
              <div className="flex items-end gap-1.5 h-6 px-4 py-1.5 border border-white/5 bg-white/[0.01] w-48">
                <span className="w-1 bg-sonar-cyan/60 animate-[indicator-bounce_0.8s_ease-in-out_infinite]" style={{ height: "45%" }} />
                <span className="w-1 bg-sonar-cyan/80 animate-[indicator-bounce_0.6s_ease-in-out_infinite_delay-100]" style={{ height: "70%" }} />
                <span className="w-1 bg-sonar-cyan animate-[indicator-bounce_0.9s_ease-in-out_infinite_delay-300]" style={{ height: "30%" }} />
                <span className="w-1 bg-sonar-cyan/50 animate-[indicator-bounce_0.5s_ease-in-out_infinite_delay-200]" style={{ height: "85%" }} />
                <span className="w-1 bg-sonar-cyan/90 animate-[indicator-bounce_0.7s_ease-in-out_infinite_delay-400]" style={{ height: "50%" }} />
              </div>
            </div>
          )}

          {/* Interactive Server Error Message */}
          {errorStatus && (
            <div className="self-center flex flex-col items-center gap-2 border border-red-500/20 bg-red-500/5 px-6 py-4 max-w-sm text-center">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
              <p className="text-[10px] text-red-300 leading-relaxed uppercase tracking-wider">
                {errorStatus}
              </p>
              <button
                onClick={() => handleSendMessage(messages[messages.length - 1]?.content || "")}
                className="mt-1.5 px-3 py-1.5 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-200 hover:text-white transition-all text-[8px] uppercase tracking-wider cursor-none"
              >
                Retry Link
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Console Suggestion Pills */}
        <div className="flex flex-col gap-2 mt-4">
          <span className="text-[8px] tracking-[0.2em] text-white/30 uppercase text-left">
            Dynamic Queries
          </span>
          <div className="flex flex-wrap gap-2 text-left justify-start">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(suggestion)}
                disabled={isThinking}
                className="py-1.5 px-3 border border-white/5 bg-white/[0.02] hover:border-sonar-cyan/40 hover:bg-sonar-cyan/10 text-slate-400 hover:text-white transition-all duration-300 text-[9px] uppercase tracking-wider font-mono cursor-none disabled:opacity-30 disabled:pointer-events-none"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="mt-3 relative flex items-center border border-white/10 bg-black/40 focus-within:border-sonar-cyan/50 focus-within:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="INPUT TELEMETRY COMMAND..."
            disabled={isThinking}
            className="w-full py-4 pl-4 pr-12 text-[10.5px] uppercase tracking-widest text-slate-100 placeholder-white/20 bg-transparent focus:outline-none focus:ring-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-none"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isThinking}
            className="absolute right-3 p-2 text-white/35 hover:text-sonar-cyan transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-none"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* RIGHT PANEL: TELEMETRY & SCANNER DATA */}
      <div className="w-full md:w-[38%] pl-0 md:pl-6 flex flex-col gap-5 select-none pt-4 md:pt-0 pointer-events-none justify-between h-[35vh] md:h-full border-t md:border-t-0 border-white/10 md:mt-0">
        
        {/* Holographic Radar Scanner */}
        <div className="relative w-full h-[100px] md:h-[130px] border border-white/5 bg-black/30 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.025)_0%,transparent_75%)]" />
          
          {/* Concentric sonar rings */}
          <div className="absolute w-20 h-20 md:w-28 md:h-28 border border-white/5 rounded-full" />
          <div className="absolute w-12 h-12 md:w-16 md:h-16 border border-white/5 rounded-full" />
          <div className="absolute w-4 h-4 border border-sonar-cyan/10 rounded-full" />

          {/* Crosshair grids */}
          <div className="absolute w-[80%] h-[1px] bg-white/5" />
          <div className="absolute h-[80%] w-[1px] bg-white/5" />

          {/* Rotating sonar sweep */}
          <div className="absolute w-20 h-20 md:w-28 md:h-28 origin-center border-t border-sonar-cyan/35 rounded-full animate-[spin_5s_linear_infinite]" />
          
          {/* Target lock overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
            {renderTelemetryIllustration()}
          </div>
          
          {/* Target classification tag */}
          <div className="absolute bottom-2 left-3 text-[7.5px] text-sonar-cyan/50 tracking-widest font-semibold uppercase">
            ANOMALY_LOCK: {discovery.id.toUpperCase()}
          </div>
        </div>

        {/* Live Submarine Telemetry parameters */}
        <div className="border border-white/5 bg-black/25 p-4 flex flex-col gap-3.5 flex-1">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[8.5px] tracking-widest text-white/35 uppercase">EXPEDITION TELEMETRY</span>
            <span className="text-[8px] text-sonar-cyan/60 animate-pulse uppercase">LIVE_LINK</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] text-white/35 uppercase">DEPTH_METRIC</span>
              <span className="text-[11.5px] font-bold text-white tracking-wide">{depth.toLocaleString()}m</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[8.5px] text-white/35 uppercase">PRESSURE_ATM</span>
              <span className="text-[11px] font-semibold text-sonar-cyan">{pressure.toLocaleString()} ATM</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[8.5px] text-white/35 uppercase">AMBIENT_TEMP</span>
              <span className="text-[11px] font-semibold text-white">{temp.toFixed(1)}°C</span>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-2">
              <span className="text-[8.5px] text-white/35 uppercase">OCEAN_ZONE</span>
              <span className="text-[9.5px] font-bold text-sonar-cyan tracking-wider uppercase">{zoneName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[8.5px] text-white/35 uppercase">COORDINATES</span>
              <span className="text-[8.5px] text-white/60 tracking-wider">
                {latitude.toFixed(4)}°N / {longitude.toFixed(4)}°E
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] text-white/35 uppercase">MISSION_STATUS</span>
              <span className="text-[8.5px] text-sonar-cyan/70 tracking-widest font-semibold uppercase animate-pulse">
                SYS_RECORDING
              </span>
            </div>
          </div>
        </div>

        {/* Lower console footer */}
        <div className="border border-white/5 bg-black/40 p-3 text-center text-[7.5px] tracking-widest text-white/20 uppercase flex flex-col gap-1">
          <span>POSEIDON SYSTEM ENVELOPE PROTOCOLS v1.0.0</span>
          <span>CHALLENGER_DEEP // EXPEDITION COMPANION LINK</span>
        </div>

      </div>

    </div>
  );
}
