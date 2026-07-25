"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  calculateDepthFromProgress,
  calculatePressureFromDepth,
  calculateTemperatureFromDepth,
  getZoneFromDepth,
} from "@/lib/oceanUtils";

export default function DepthHUD() {
  const depthRef = useRef<HTMLSpanElement | null>(null);
  const pressureRef = useRef<HTMLSpanElement | null>(null);
  const tempRef = useRef<HTMLSpanElement | null>(null);
  const zoneRef = useRef<HTMLSpanElement | null>(null);
  const gaugeFillRef = useRef<HTMLDivElement | null>(null);
  const gaugeCursorRef = useRef<HTMLDivElement | null>(null);
  const gaugeTrackRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

      const depth = calculateDepthFromProgress(progress);
      const pressure = calculatePressureFromDepth(depth);
      const temp = calculateTemperatureFromDepth(depth);
      const zoneName = getZoneFromDepth(depth);

      if (depthRef.current) depthRef.current.innerText = `${depth.toLocaleString()}m`;
      if (pressureRef.current) pressureRef.current.innerText = `${pressure.toLocaleString()} ATM`;
      if (tempRef.current) tempRef.current.innerText = `${temp.toFixed(1)}°C`;
      if (zoneRef.current) zoneRef.current.innerText = zoneName.toUpperCase();

      const fillPercentage = `${(progress * 100).toFixed(1)}%`;
      if (gaugeFillRef.current) {
        gaugeFillRef.current.style.height = fillPercentage;
      }
      if (gaugeCursorRef.current) {
        gaugeCursorRef.current.style.top = fillPercentage;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scrub scroll window based on click/drag position on the vertical bar
  const scrollFromRatio = (ratio: number) => {
    const clamped = Math.max(0, Math.min(1, ratio));
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: clamped * maxScroll,
      behavior: isDragging ? "auto" : "smooth",
    });
  };

  const handleTrackInteraction = (clientY: number) => {
    if (!gaugeTrackRef.current) return;
    const rect = gaugeTrackRef.current.getBoundingClientRect();
    const clickY = clientY - rect.top;
    const ratio = clickY / rect.height;
    scrollFromRatio(ratio);
  };

  const handleTrackMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleTrackInteraction(e.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      handleTrackInteraction(e.clientY);
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  // Specific target depth quick jumps
  const jumpToDepthMeters = (targetMeters: number) => {
    const maxDepth = 11000;
    const ratio = targetMeters / maxDepth;
    scrollFromRatio(ratio);
  };

  return (
    <div className="fixed top-16 md:top-20 right-4 md:right-8 z-30 w-40 md:w-48 pointer-events-auto flex flex-col gap-3 font-mono select-none">
      {/* Telemetry Card */}
      <div className="border border-white/10 bg-black/50 backdrop-blur-xl p-3.5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <span className="text-[9px] tracking-[0.25em] text-white/40 uppercase font-medium">
            TELEMETRY
          </span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sonar-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sonar-cyan"></span>
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="text-[7.5px] tracking-[0.2em] text-white/30 uppercase">DEPTH</span>
            <span ref={depthRef} className="text-sm md:text-base font-semibold text-white tracking-wider">
              0m
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[7.5px] tracking-[0.2em] text-white/30 uppercase">PRESSURE</span>
            <span ref={pressureRef} className="text-xs font-medium text-sonar-cyan/90">
              1 ATM
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[7.5px] tracking-[0.2em] text-white/30 uppercase">WATER TEMP</span>
            <span ref={tempRef} className="text-xs font-medium text-white/70">
              20.0°C
            </span>
          </div>

          <div className="flex flex-col border-t border-white/10 pt-2 mt-1">
            <span className="text-[7.5px] tracking-[0.2em] text-white/30 uppercase">ZONE</span>
            <span ref={zoneRef} className="text-[11px] font-semibold text-sonar-cyan tracking-wider mt-0.5">
              SURFACE
            </span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE DEPTH GAUGE SCRUBBER BAR */}
      <div className="self-end mr-1 flex items-center gap-3 h-36 md:h-44 group/gauge">
        {/* Clickable Depth Labels */}
        <div className="flex flex-col justify-between h-full text-[8.5px] font-mono text-white/40 hover:text-white text-right select-none tracking-widest py-0.5">
          <button type="button" onClick={() => jumpToDepthMeters(0)} className="hover:text-sonar-cyan transition-colors text-right font-medium">0m</button>
          <button type="button" onClick={() => jumpToDepthMeters(200)} className="hover:text-sonar-cyan transition-colors text-right font-medium">200m</button>
          <button type="button" onClick={() => jumpToDepthMeters(1000)} className="hover:text-sonar-cyan transition-colors text-right font-medium">1k</button>
          <button type="button" onClick={() => jumpToDepthMeters(4000)} className="hover:text-sonar-cyan transition-colors text-right font-medium">4k</button>
          <button type="button" onClick={() => jumpToDepthMeters(6000)} className="hover:text-sonar-cyan transition-colors text-right font-medium">6k</button>
          <button type="button" onClick={() => jumpToDepthMeters(10928)} className="hover:text-sonar-cyan transition-colors text-right font-medium">11k</button>
        </div>
        
        {/* Track & Drag Bar */}
        <div
          ref={gaugeTrackRef}
          onMouseDown={handleTrackMouseDown}
          className="relative w-3.5 h-full bg-white/5 border border-white/15 hover:border-sonar-cyan/60 rounded-full flex justify-center transition-all cursor-ns-resize shadow-inner group-hover/gauge:bg-white/10"
        >
          {/* Internal Track Line */}
          <div className="w-[2px] h-full bg-white/20 relative overflow-hidden pointer-events-none">
            <div
              ref={gaugeFillRef}
              className="absolute top-0 left-0 w-full bg-sonar-cyan transition-all duration-75"
              style={{ height: "0%" }}
            />
          </div>

          {/* Draggable Handle Indicator */}
          <div
            ref={gaugeCursorRef}
            className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sonar-cyan bg-sonar-cyan shadow-[0_0_15px_rgba(0,240,255,1)] transition-transform ${
              isDragging ? "w-4 h-4 scale-125 bg-white" : "w-3 h-3 group-hover/gauge:scale-110"
            }`}
            style={{ top: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
