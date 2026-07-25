/**
 * ABYSS AI - Programmatic Submarine Audio Synthesis Engine
 * Synthesizes retro-futuristic deep-sea acoustic effects using Web Audio API.
 * No external media assets/files required. Fits zero-asset bundle.
 */

let audioCtx: AudioContext | null = null;
let engineHumNode: OscillatorNode | null = null;
let engineHumGain: GainNode | null = null;
let isMutedGlobal = false;

// Initialize or retrieve the browser AudioContext (lazily created on first interaction)
const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const win = window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext: typeof AudioContext };
    audioCtx = new (win.AudioContext || win.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

// Global Mute Controllers
export const isMuted = () => isMutedGlobal;

export const toggleMute = () => {
  isMutedGlobal = !isMutedGlobal;
  const ctx = getAudioContext();
  if (ctx) {
    if (isMutedGlobal) {
      engineHumGain?.gain.setValueAtTime(0, ctx.currentTime);
    } else {
      engineHumGain?.gain.setValueAtTime(0.025, ctx.currentTime);
    }
  }
  return isMutedGlobal;
};

// 1. Synthesize Sonar Ping (Echoing sine decay)
export const playSonarPing = () => {
  if (isMutedGlobal) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.setValueAtTime(620, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 1.6);

  gainNode.gain.setValueAtTime(0.28, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(800, ctx.currentTime);

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 2.0);
};

// 2. Synthesize Mechanical Click (Short oscillator pop)
export const playClickSound = () => {
  if (isMutedGlobal) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.04);

  gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

// 3. Synthesize Console Beep (High frequency prompt alert)
export const playConsoleBeep = () => {
  if (isMutedGlobal) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);

  gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
};

// 4. Synthesize Radar Pulse (Low frequency sweep)
export const playRadarPulse = () => {
  if (isMutedGlobal) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.setValueAtTime(95, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.45);

  gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(180, ctx.currentTime);

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.5);
};

// 5. Synthesize Bubble Pop (Quick high-pitch square sweep)
export const playBubblePop = () => {
  if (isMutedGlobal) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.035);

  gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.04);
};

// 6. Synthesize Submarine Engine Ambient Hum (Looping low frequency)
export const startAmbientHum = () => {
  const ctx = getAudioContext();
  if (!ctx || engineHumNode) return;

  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(48, ctx.currentTime); // Low engine bass note

    gainNode.gain.setValueAtTime(isMutedGlobal ? 0 : 0.025, ctx.currentTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(75, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    
    engineHumNode = osc;
    engineHumGain = gainNode;
  } catch (err) {
    console.error("Ambient hum failed to start: ", err);
  }
};
