// Lightweight Web Audio API procedural sound synthesizer (no external assets)

const SOUND_STORAGE_KEY = 'arrow_escape_sound_enabled';

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(SOUND_STORAGE_KEY);
        if (stored !== null) {
          this.enabled = stored === 'true';
        }
      } catch {
        this.enabled = true;
      }
    }
  }

  public setEnabled(val: boolean): void {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(SOUND_STORAGE_KEY, String(val));
      } catch {
        // Fallback
      }
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  private initContext(): boolean {
    if (!this.enabled) return false;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return Boolean(this.ctx);
  }

  public playEscape(): void {
    if (!this.enabled) return;
    try {
      if (!this.initContext() || !this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Bright, pleasant harmonic whoosh sweep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.22);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playBlocked(): void {
    if (!this.enabled) return;
    try {
      if (!this.initContext() || !this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Quick dull knock / thud
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.14);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playTap(): void {
    if (!this.enabled) return;
    try {
      if (!this.initContext() || !this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Fallback
    }
  }

  public playVictory(): void {
    if (!this.enabled) return;
    try {
      if (!this.initContext() || !this.ctx) return;

      // Sparkling celebratory chord arpeggio (C5 - E5 - G5 - C6) with shimmer
      const chord = [523.25, 659.25, 783.99, 1046.5];
      const start = this.ctx.currentTime;

      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = start + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.35);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playCoin(): void {
    if (!this.enabled) return;
    try {
      if (!this.initContext() || !this.ctx) return;

      const now = this.ctx.currentTime;
      // High bright bell ping: note 1 then note 2
      const notes = [987.77, 1318.51];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = now + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.22);
      });
    } catch {
      // Fallback
    }
  }
}

export const sound = new SoundManager();

