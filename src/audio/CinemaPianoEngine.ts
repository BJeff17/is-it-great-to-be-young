export class CinemaPianoEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private pivotGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;

  private started = false;
  private muted = false;
  private ducked = false;
  private enabled = true;
  private volume = 0.28;
  private reverbWet = 0.68;
  private blackout = false;
  private curtainOpen = false;

  private currentSlide = 0;
  private currentBeat = 0;
  private schedulerTimer: number | null = null;
  private nextStepTime = 0;
  private stepIdx = 0;
  private barIdx = 0;
  private pivotBloomed = false;
  private finaleResolved = false;

  private onChange?: () => void;

  constructor(onChange?: () => void) {
    this.onChange = onChange;
  }

  private midiToFreq(m: number): number {
    return 440 * Math.pow(2, (m - 69) / 12);
  }

  private buildReverbBuffer(ctx: AudioContext): AudioBuffer {
    const sr = ctx.sampleRate;
    const duration = 2.8;
    const len = Math.floor(sr * duration);
    const buf = ctx.createBuffer(2, len, sr);
    const preDelay = Math.floor(sr * 0.014);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      let lp = 0;
      for (let i = preDelay; i < len; i++) {
        const t = (i - preDelay) / (len - preDelay);
        const env = Math.pow(1 - t, 2.75);
        const white = Math.random() * 2 - 1;
        lp = lp * 0.72 + white * 0.28;
        data[i] = lp * env * 0.55;
      }
    }
    return buf;
  }

  ensureStarted(): void {
    if (!this.enabled) return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.duckGain = this.ctx.createGain();
      this.pivotGain = this.ctx.createGain();
      this.dryGain = this.ctx.createGain();
      this.wetGain = this.ctx.createGain();
      this.convolver = this.ctx.createConvolver();
      this.convolver.buffer = this.buildReverbBuffer(this.ctx);

      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.duckGain.gain.setValueAtTime(1.0, now);
      this.pivotGain.gain.setValueAtTime(1.0, now);
      this.dryGain.gain.setValueAtTime(0.42, now);
      this.wetGain.gain.setValueAtTime(this.reverbWet, now);

      this.dryGain.connect(this.pivotGain);
      this.wetGain.connect(this.convolver);
      this.convolver.connect(this.pivotGain);
      this.pivotGain.connect(this.duckGain);
      this.duckGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    if (!this.started) {
      this.started = true;
      this.nextStepTime = this.ctx.currentTime + 0.12;
      this.schedulerTimer = window.setInterval(() => this.tick(), 180);
    }
    this.syncLevels();
  }

  setSettings(opts: {
    enabled: boolean;
    volume: number;
    reverbWet: number;
    blackout: boolean;
    curtainOpen: boolean;
  }): void {
    this.enabled = opts.enabled;
    this.volume = opts.volume;
    this.reverbWet = opts.reverbWet;
    this.blackout = opts.blackout;
    this.curtainOpen = opts.curtainOpen;
    this.syncLevels();
  }

  syncLevels(): void {
    if (!this.ctx || !this.masterGain || !this.duckGain || !this.wetGain) {
      this.onChange?.();
      return;
    }
    const now = this.ctx.currentTime;
    const vol = this.enabled && !this.muted ? Math.max(0.0001, this.volume) : 0.0001;
    const duckTarget = this.blackout ? 0.08 : this.ducked ? 0.35 : 1.0;
    this.masterGain.gain.setTargetAtTime(vol, now, 0.38);
    this.duckGain.gain.setTargetAtTime(duckTarget, now, 0.35);
    this.wetGain.gain.setTargetAtTime(Math.max(0.05, this.reverbWet), now, 0.25);
    this.onChange?.();
  }

  private playNote(midi: number, velocity = 0.45, durationSec = 4.0, when?: number): void {
    if (!this.ctx || !this.dryGain || !this.wetGain || !this.enabled || this.muted) return;
    const t0 = when ?? this.ctx.currentTime;

    const noteOut = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoffPeak = 1050 + Math.min(1, velocity) * 700;
    filter.frequency.setValueAtTime(cutoffPeak, t0);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(420, cutoffPeak * 0.42),
      t0 + Math.min(durationSec, 2.2)
    );
    filter.Q.setValueAtTime(0.7, t0);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    const g2 = this.ctx.createGain();
    const g3 = this.ctx.createGain();

    const f = this.midiToFreq(midi);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(f, t0);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(f * 2, t0);
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(f * 3, t0);

    g1.gain.setValueAtTime(1.0, t0);
    g2.gain.setValueAtTime(0.22, t0);
    g2.gain.exponentialRampToValueAtTime(0.02, t0 + durationSec * 0.55);
    g3.gain.setValueAtTime(0.07, t0);
    g3.gain.exponentialRampToValueAtTime(0.005, t0 + durationSec * 0.3);

    const peak = Math.max(0.02, velocity * 0.34);
    noteOut.gain.setValueAtTime(0.0001, t0);
    noteOut.gain.linearRampToValueAtTime(peak, t0 + 0.016);
    noteOut.gain.exponentialRampToValueAtTime(peak * 0.28, t0 + durationSec * 0.42);
    noteOut.gain.exponentialRampToValueAtTime(0.0001, t0 + durationSec);

    osc1.connect(g1);
    g1.connect(filter);
    osc2.connect(g2);
    g2.connect(filter);
    osc3.connect(g3);
    g3.connect(filter);
    filter.connect(noteOut);
    noteOut.connect(this.dryGain);
    noteOut.connect(this.wetGain);

    osc1.start(t0);
    osc2.start(t0);
    osc3.start(t0);
    const stopAt = t0 + durationSec + 0.08;
    osc1.stop(stopAt);
    osc2.stop(stopAt);
    osc3.stop(stopAt);
  }

  onSlideChange(slideIdx: number, beatIdx: number): void {
    this.currentSlide = slideIdx;
    this.currentBeat = beatIdx;
    if (!this.ctx || !this.pivotGain || !this.enabled) return;

    const now = this.ctx.currentTime;
    if (slideIdx === 5) {
      if (beatIdx === 0) {
        this.pivotBloomed = false;
        this.pivotGain.gain.setTargetAtTime(0.0001, now, 0.52);
      } else if (beatIdx >= 1 && !this.pivotBloomed) {
        this.pivotBloomed = true;
        this.pivotGain.gain.setTargetAtTime(1.0, now, 0.08);
        const fmaj9 = [53, 60, 67, 69, 76];
        fmaj9.forEach((m, i) => {
          this.playNote(m, 0.34 + i * 0.03, 5.4, now + i * 0.075);
        });
        this.nextStepTime = now + 2.6;
      }
      return;
    }

    this.pivotBloomed = false;
    this.pivotGain.gain.setTargetAtTime(1.0, now, 0.25);
    if (slideIdx !== 11) {
      this.finaleResolved = false;
    }
  }

  private tick(): void {
    if (!this.ctx || !this.enabled || this.muted || this.curtainOpen) return;
    if (this.currentSlide === 5) {
      this.nextStepTime = this.ctx.currentTime + 0.25;
      return;
    }

    const now = this.ctx.currentTime;
    while (this.nextStepTime < now + 0.22) {
      const stepSec = this.scheduleStep(this.nextStepTime);
      this.nextStepTime += stepSec;
    }
  }

  private scheduleStep(when: number): number {
    if (this.currentSlide === 0) {
      const seq: Array<number | null> = [50, null, 57, 64, null, 65, 69, null, 64, null, 57, null];
      const n = seq[this.stepIdx % seq.length];
      if (n !== null) {
        this.playNote(n, 0.34, 4.4, when);
      }
      this.stepIdx++;
      return 1.05;
    }

    if (this.currentSlide >= 1 && this.currentSlide <= 4) {
      const bars = [
        { bass: 38, arp: [50, 57, 64, 65, 69, 64] },
        { bass: 46, arp: [53, 57, 62, 65, 69, 62] },
        { bass: 43, arp: [55, 58, 62, 65, 69, 65] },
        { bass: 45, arp: [57, 62, 64, 67, 69, 64] },
      ];
      const bar = bars[this.barIdx % bars.length];
      const pos = this.stepIdx % 6;

      if (pos === 0) {
        const bassNote = this.currentSlide === 4 ? bar.bass - 12 : bar.bass;
        this.playNote(bassNote, this.currentSlide === 4 ? 0.44 : 0.36, 4.8, when);
      }
      const skipUpper = this.currentSlide === 4 && (pos === 2 || pos === 4);
      if (!skipUpper) {
        this.playNote(bar.arp[pos], 0.3 + (pos === 4 ? 0.06 : 0), 3.6, when);
      }
      if (this.currentSlide === 2 && (pos === 3 || pos === 5)) {
        const rain = pos === 3 ? 76 : 77;
        this.playNote(rain, 0.18, 3.2, when + 0.04);
      }

      this.stepIdx++;
      if (this.stepIdx % 6 === 0) this.barIdx++;
      return this.currentSlide === 3 ? 0.88 : 0.98;
    }

    const goldenBars = [
      { bass: 41, arp: [53, 60, 64, 69, 72, 69] },
      { bass: 40, arp: [55, 60, 64, 71, 72, 67] },
      { bass: 38, arp: [57, 60, 64, 69, 72, 64] },
      { bass: 46, arp: [53, 57, 62, 65, 69, 62] },
    ];

    if (this.currentSlide === 11 && this.currentBeat >= 1) {
      if (!this.finaleResolved) {
        this.finaleResolved = true;
        const cadence = [41, 53, 60, 67, 69, 77];
        cadence.forEach((m, i) => {
          this.playNote(m, 0.32, 5.5, when + i * 0.11);
        });
        return 3.8;
      }
      const endNotes: Array<number | null> = [60, null, 69, null, 72, null];
      const n = endNotes[this.stepIdx % endNotes.length];
      if (n !== null) this.playNote(n, 0.24, 4.8, when);
      this.stepIdx++;
      return 1.25;
    }

    const gBar = goldenBars[this.barIdx % goldenBars.length];
    const pos = this.stepIdx % 6;
    if (pos === 0) {
      this.playNote(gBar.bass, 0.36, 4.6, when);
    }
    this.playNote(gBar.arp[pos], 0.34 + (pos === 4 ? 0.06 : 0), 3.8, when);

    if (this.currentSlide === 9 && pos === 4) {
      this.playNote(79, 0.2, 3.6, when + 0.03);
    }
    if (this.currentSlide === 10 && (pos === 2 || pos === 5)) {
      this.playNote(pos === 2 ? 77 : 81, 0.19, 3.8, when + 0.02);
    }

    this.stepIdx++;
    if (this.stepIdx % 6 === 0) this.barIdx++;
    return this.currentSlide === 10 ? 1.15 : 0.88;
  }

  toggleMute(): void {
    this.ensureStarted();
    this.muted = !this.muted;
    this.syncLevels();
  }

  toggleDuck(): void {
    this.ensureStarted();
    this.ducked = !this.ducked;
    this.syncLevels();
  }

  getStatus() {
    return {
      started: this.started,
      muted: this.muted,
      ducked: this.ducked,
    };
  }

  destroy(): void {
    if (this.schedulerTimer !== null) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}
