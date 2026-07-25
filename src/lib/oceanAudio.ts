// Web Audio API Synthesizer for Deep Sea Hydrophone Ambient Audio
class OceanAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    if (typeof window === "undefined") return;
    
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);

      // Lowpass filter to simulate underwater hydrophone muffling
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(140, this.ctx.currentTime);

      // Sub-bass rumble oscillator (45Hz)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = "sine";
      this.osc1.frequency.setValueAtTime(45, this.ctx.currentTime);

      // Resonance drone (68Hz)
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = "triangle";
      this.osc2.frequency.setValueAtTime(68, this.ctx.currentTime);

      this.osc1.connect(this.filterNode);
      this.osc2.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.osc1.start();
      this.osc2.start();
      this.isPlaying = true;
    } catch {
      // Audio context fallbacks
    }
  }

  public stop() {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        this.osc1?.stop();
        this.osc2?.stop();
        this.ctx?.close();
        this.isPlaying = false;
      }, 500);
    }
  }

  public setDepth(depth: number) {
    if (!this.filterNode || !this.ctx) return;
    // Lower filter frequency as depth increases (deep ocean absorbs high frequencies)
    const cutoff = Math.max(60, 180 - (depth / 11000) * 120);
    this.filterNode.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.2);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const oceanAudio = new OceanAudioEngine();
