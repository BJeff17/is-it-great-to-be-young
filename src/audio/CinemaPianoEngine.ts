import type { SoundMode } from '../types/presentation';

export class CinemaPianoEngine {
  private ctx: AudioContext | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private warmShelf: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private pivotGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private padBus: GainNode | null = null;
  private convolver: ConvolverNode | null = null;

  private started = false;
  private muted = false;
  private ducked = false;
  private enabled = true;
  private soundMode: SoundMode = 'cinema';
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
  private lastPadBarKey = '';
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
    const duration = 2.6;
    const len = Math.floor(sr * duration);
    const buf = ctx.createBuffer(2, len, sr);
    const preDelay = Math.floor(sr * 0.016);
    const fadeInSamples = Math.floor(sr * 0.025);

    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      let lp1 = 0;
      let lp2 = 0;
      for (let i = preDelay; i < len; i++) {
        const rel = i - preDelay;
        const t = rel / (len - preDelay);
        let env = Math.pow(1 - t, 2.85);
        if (rel < fadeInSamples) {
          env *= rel / fadeInSamples;
        }
        const white = Math.random() * 2 - 1;
        // Two-pass low-pass smoothing for silky non-clipping tail
        lp1 = lp1 * 0.76 + white * 0.24;
        lp2 = lp2 * 0.72 + lp1 * 0.28;
        data[i] = lp2 * env * 0.18;
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

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(24, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.015, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.warmShelf = this.ctx.createBiquadFilter();
      this.warmShelf.type = 'highshelf';
      this.warmShelf.frequency.setValueAtTime(3200, this.ctx.currentTime);
      this.warmShelf.gain.setValueAtTime(-3.5, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.duckGain = this.ctx.createGain();
      this.pivotGain = this.ctx.createGain();
      this.dryGain = this.ctx.createGain();
      this.wetGain = this.ctx.createGain();
      this.padBus = this.ctx.createGain();
      this.convolver = this.ctx.createConvolver();
      this.convolver.buffer = this.buildReverbBuffer(this.ctx);

      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.duckGain.gain.setValueAtTime(1.0, now);
      this.pivotGain.gain.setValueAtTime(1.0, now);
      this.dryGain.gain.setValueAtTime(0.42, now);
      this.wetGain.gain.setValueAtTime(this.reverbWet * 0.85, now);
      this.padBus.gain.setValueAtTime(this.soundMode === 'solo' ? 0 : 0.22, now);

      this.dryGain.connect(this.compressor);
      this.wetGain.connect(this.convolver);
      this.convolver.connect(this.compressor);
      this.padBus.connect(this.compressor);

      this.compressor.connect(this.warmShelf);
      this.warmShelf.connect(this.pivotGain);
      this.pivotGain.connect(this.duckGain);
      this.duckGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    if (!this.started) {
      this.started = true;
      this.nextStepTime = this.ctx.currentTime + 0.14;
      this.schedulerTimer = window.setInterval(() => this.tick(), 100);
    }
    this.syncLevels();
  }

  setSettings(opts: {
    enabled: boolean;
    soundMode: SoundMode;
    volume: number;
    reverbWet: number;
    blackout: boolean;
    curtainOpen: boolean;
  }): void {
    this.enabled = opts.enabled;
    this.soundMode = opts.soundMode;
    this.volume = opts.volume;
    this.reverbWet = opts.reverbWet;
    this.blackout = opts.blackout;
    this.curtainOpen = opts.curtainOpen;
    this.syncLevels();
  }

  syncLevels(): void {
    if (!this.ctx || !this.masterGain || !this.duckGain || !this.wetGain || !this.padBus) {
      this.onChange?.();
      return;
    }
    const now = this.ctx.currentTime;
    const modeScale = this.soundMode === 'soft' ? 0.72 : 1.0;
    const vol =
      this.enabled && !this.muted
        ? Math.max(0.0001, this.volume * modeScale)
        : 0.0001;
    const duckTarget = this.blackout ? 0.06 : this.ducked ? 0.35 : 1.0;
    const padTarget = this.soundMode === 'solo' ? 0.0001 : this.soundMode === 'soft' ? 0.16 : 0.24;

    this.masterGain.gain.setTargetAtTime(vol, now, 0.38);
    this.duckGain.gain.setTargetAtTime(duckTarget, now, 0.35);
    this.wetGain.gain.setTargetAtTime(Math.max(0.04, this.reverbWet * 0.85), now, 0.25);
    this.padBus.gain.setTargetAtTime(padTarget, now, 0.35);
    this.onChange?.();
  }

  private playNote(midi: number, velocity = 0.42, durationSec = 3.8, when?: number): void {
    if (!this.ctx || !this.dryGain || !this.wetGain || !this.enabled || this.muted) return;
    const t0 = Math.max(this.ctx.currentTime + 0.005, when ?? this.ctx.currentTime + 0.005);
    const velScale = this.soundMode === 'soft' ? velocity * 0.78 : velocity;
    const dur = Math.max(0.8, durationSec);

    const noteOut = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoffPeak = 980 + Math.min(1, velScale) * 680;
    filter.frequency.setValueAtTime(cutoffPeak, t0);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(380, cutoffPeak * 0.4),
      t0 + Math.min(dur, 2.2)
    );
    filter.Q.setValueAtTime(0.65, t0);

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
    g2.gain.setValueAtTime(0.19, t0);
    g2.gain.exponentialRampToValueAtTime(0.015, t0 + dur * 0.52);
    g3.gain.setValueAtTime(0.055, t0);
    g3.gain.exponentialRampToValueAtTime(0.004, t0 + dur * 0.28);

    const peak = Math.max(0.015, velScale * 0.31);
    const stopAt = t0 + dur;
    noteOut.gain.setValueAtTime(0, t0);
    noteOut.gain.linearRampToValueAtTime(peak, t0 + 0.024);
    noteOut.gain.exponentialRampToValueAtTime(Math.max(0.001, peak * 0.24), t0 + dur * 0.45);
    noteOut.gain.exponentialRampToValueAtTime(0.001, stopAt - 0.045);
    noteOut.gain.linearRampToValueAtTime(0, stopAt - 0.01);

    osc1.connect(g1);
    g1.connect(filter);
    osc2.connect(g2);
    g2.connect(filter);
    osc3.connect(g3);
    g3.connect(filter);
    filter.connect(noteOut);
    noteOut.connect(this.dryGain);
    noteOut.connect(this.wetGain);

    osc1.onended = () => {
      noteOut.disconnect();
      filter.disconnect();
      osc1.disconnect();
      osc2.disconnect();
      osc3.disconnect();
    };

    osc1.start(t0);
    osc2.start(t0);
    osc3.start(t0);
    osc1.stop(stopAt);
    osc2.stop(stopAt);
    osc3.stop(stopAt);
  }

  private playPadChord(midis: number[], durationSec = 5.6, when?: number): void {
    if (
      !this.ctx ||
      !this.padBus ||
      !this.enabled ||
      this.muted ||
      this.soundMode === 'solo'
    ) {
      return;
    }
    const t0 = Math.max(this.ctx.currentTime + 0.01, when ?? this.ctx.currentTime + 0.01);
    const dur = Math.max(3.6, durationSec);
    const stopAt = t0 + dur;

    for (const m of midis) {
      const f = this.midiToFreq(m);
      const voiceGain = this.ctx.createGain();
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(640, t0);
      lp.Q.setValueAtTime(0.6, t0);

      const oscA = this.ctx.createOscillator();
      const oscB = this.ctx.createOscillator();
      oscA.type = 'sine';
      oscB.type = 'sine';
      oscA.frequency.setValueAtTime(f, t0);
      oscB.frequency.setValueAtTime(f, t0);
      oscA.detune.setValueAtTime(-3.5, t0);
      oscB.detune.setValueAtTime(3.5, t0);

      const peak = 0.075 / Math.max(1, midis.length * 0.65);
      voiceGain.gain.setValueAtTime(0, t0);
      voiceGain.gain.linearRampToValueAtTime(peak, t0 + 1.65);
      voiceGain.gain.setValueAtTime(peak, t0 + dur - 2.4);
      voiceGain.gain.linearRampToValueAtTime(0, stopAt - 0.015);

      oscA.connect(lp);
      oscB.connect(lp);
      lp.connect(voiceGain);
      voiceGain.connect(this.padBus);

      oscA.onended = () => {
        voiceGain.disconnect();
        lp.disconnect();
        oscA.disconnect();
        oscB.disconnect();
      };

      oscA.start(t0);
      oscB.start(t0);
      oscA.stop(stopAt);
      oscB.stop(stopAt);
    }
  }

  playPreviewChord(): void {
    this.ensureStarted();
    if (!this.ctx) return;
    const now = this.ctx.currentTime + 0.02;
    const chord = [53, 60, 67, 69, 76];
    chord.forEach((m, i) => this.playNote(m, 0.36 + i * 0.025, 3.8, now + i * 0.065));
    this.playPadChord([41, 53, 60], 4.2, now);
  }

  onSlideChange(slideIdx: number, beatIdx: number): void {
    this.currentSlide = slideIdx;
    this.currentBeat = beatIdx;
    if (!this.ctx || !this.pivotGain || !this.enabled) return;

    const now = this.ctx.currentTime;
    if (slideIdx === 5) {
      if (beatIdx === 0) {
        this.pivotBloomed = false;
        this.pivotGain.gain.setTargetAtTime(0.0001, now, 0.35);
      } else if (beatIdx >= 1 && !this.pivotBloomed) {
        this.pivotBloomed = true;
        this.pivotGain.gain.setTargetAtTime(1.0, now, 0.08);
        const fmaj9 = [53, 60, 67, 69, 76];
        fmaj9.forEach((m, i) => {
          this.playNote(m, 0.34 + i * 0.03, 5.4, now + i * 0.075);
        });
        this.playPadChord([41, 53, 60, 67], 6.0, now + 0.05);
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
    while (this.nextStepTime < now + 0.25) {
      const stepSec = this.scheduleStep(this.nextStepTime);
      const rubato = (Math.random() - 0.5) * 0.018;
      this.nextStepTime += Math.max(0.35, stepSec + rubato);
    }
  }

  private triggerBarPad(key: string, notes: number[], dur: number, when: number): void {
    if (this.lastPadBarKey === key) return;
    this.lastPadBarKey = key;
    this.playPadChord(notes, dur, when);
  }

  private scheduleStep(when: number): number {
    // 01 — Opening (Satie/Frahm sparse chords & hesitant motif, ~54 BPM)
    if (this.currentSlide === 0) {
      const seq: Array<number | null> = [50, null, 57, 64, null, 65, 69, null, 64, null, 57, null];
      const pos = this.stepIdx % seq.length;
      if (pos === 0) {
        this.triggerBarPad(`s0-${Math.floor(this.stepIdx / seq.length)}`, [38, 50, 57], 6.5, when);
      }
      const n = seq[pos];
      if (n !== null) {
        this.playNote(n, 0.32, 4.4, when);
      }
      this.stepIdx++;
      return 1.05;
    }

    // 02–03 — Micro / Childhood (Hisaishi-inspired tender 6/8 waltz lullaby)
    if (this.currentSlide === 1 || this.currentSlide === 2) {
      const waltzBars = [
        { bass: 38, pad: [38, 50, 57], arp: [50, 57, 64, 65, 69, 64], mel: 74 }, // Dm9
        { bass: 48, pad: [48, 55, 60], arp: [55, 60, 64, 67, 72, 67], mel: 76 }, // Am7/C
        { bass: 46, pad: [46, 53, 57], arp: [53, 57, 62, 65, 69, 62], mel: 74 }, // Bbmaj7
        { bass: 45, pad: [45, 52, 57], arp: [57, 62, 64, 67, 69, 64], mel: 72 }, // A7sus4
      ];
      const bar = waltzBars[this.barIdx % waltzBars.length];
      const pos = this.stepIdx % 6;

      if (pos === 0) {
        this.playNote(bar.bass, 0.36, 4.8, when);
        this.triggerBarPad(`w-${this.barIdx}`, bar.pad, 5.4, when);
      }
      if (pos === 3) {
        this.playNote(bar.mel, 0.28, 3.4, when);
      }
      this.playNote(bar.arp[pos], 0.29 + (pos === 4 ? 0.05 : 0), 3.6, when);

      if (this.currentSlide === 2 && (pos === 2 || pos === 5)) {
        this.playNote(pos === 2 ? 77 : 81, 0.16, 3.0, when + 0.04);
      }

      this.stepIdx++;
      if (this.stepIdx % 6 === 0) this.barIdx++;
      return 0.86;
    }

    // 04–05 — Macro / Alternance & The Bill (Einaudi-inspired driving pulse)
    if (this.currentSlide === 3 || this.currentSlide === 4) {
      const pulseBars = [
        { bass: 43, pad: [43, 50, 58], arp: [55, 58, 62, 69, 62, 58] }, // Gm9
        { bass: 41, pad: [41, 50, 57], arp: [53, 57, 62, 69, 62, 57] }, // Dm/F
        { bass: 39, pad: [39, 51, 58], arp: [51, 55, 58, 62, 58, 55] }, // Ebmaj7
        { bass: 45, pad: [45, 52, 57], arp: [52, 57, 62, 64, 62, 57] }, // Asus4
      ];
      const bar = pulseBars[this.barIdx % pulseBars.length];
      const pos = this.stepIdx % 6;

      if (pos === 0 || pos === 3) {
        const bassNote = this.currentSlide === 4 ? bar.bass - 12 : bar.bass;
        this.playNote(bassNote, this.currentSlide === 4 ? 0.42 : 0.34, 3.8, when);
      }
      if (pos === 0) {
        this.triggerBarPad(`p-${this.barIdx}`, bar.pad, 4.8, when);
      }
      const skipUpper = this.currentSlide === 4 && pos === 4;
      if (!skipUpper) {
        this.playNote(bar.arp[pos], 0.29 + (pos === 2 ? 0.05 : 0), 3.1, when);
      }

      this.stepIdx++;
      if (this.stepIdx % 6 === 0) this.barIdx++;
      return this.currentSlide === 3 ? 0.68 : 0.82;
    }

    // 07–12 — Golden Hour & Finale (Fmaj9 -> Csus2/E -> Dm9 -> Bbmaj9)
    const goldenBars = [
      { bass: 41, pad: [41, 53, 60], arp: [53, 60, 64, 69, 72, 69], mel: [72, 74] }, // Fmaj9
      { bass: 40, pad: [40, 52, 55], arp: [55, 60, 62, 67, 72, 67], mel: [76, 72] }, // Csus2/E
      { bass: 38, pad: [38, 50, 57], arp: [57, 60, 64, 69, 72, 64], mel: [79, 77] }, // Dm9
      { bass: 46, pad: [46, 53, 58], arp: [53, 58, 60, 65, 69, 62], mel: [76, 72] }, // Bbmaj9
    ];

    if (this.currentSlide === 11 && this.currentBeat >= 1) {
      if (!this.finaleResolved) {
        this.finaleResolved = true;
        const cadence = [41, 53, 60, 67, 69, 77];
        cadence.forEach((m, i) => {
          this.playNote(m, 0.31, 5.4, when + i * 0.11);
        });
        this.playPadChord([41, 53, 60, 69], 6.4, when + 0.05);
        return 3.8;
      }
      const endNotes: Array<number | null> = [60, null, 69, null, 72, null];
      const n = endNotes[this.stepIdx % endNotes.length];
      if (n !== null) this.playNote(n, 0.22, 4.6, when);
      this.stepIdx++;
      return 1.25;
    }

    const gBar = goldenBars[this.barIdx % goldenBars.length];
    const pos = this.stepIdx % 6;
    if (pos === 0) {
      this.playNote(gBar.bass, 0.35, 4.6, when);
      this.triggerBarPad(`g-${this.barIdx}`, gBar.pad, 5.2, when);
      if (this.currentSlide >= 6 && this.currentSlide <= 9) {
        this.playNote(gBar.mel[0], 0.28, 3.6, when + 0.02);
      }
    }
    if (pos === 3 && this.currentSlide >= 6 && this.currentSlide <= 9) {
      this.playNote(gBar.mel[1], 0.25, 3.2, when + 0.02);
    }

    this.playNote(gBar.arp[pos], 0.31 + (pos === 4 ? 0.05 : 0), 3.6, when);

    if (this.currentSlide === 9 && pos === 4) {
      this.playNote(81, 0.18, 3.4, when + 0.03);
    }
    if (this.currentSlide === 10 && (pos === 2 || pos === 5)) {
      this.playNote(pos === 2 ? 77 : 81, 0.17, 3.6, when + 0.02);
    }

    this.stepIdx++;
    if (this.stepIdx % 6 === 0) this.barIdx++;
    return this.currentSlide >= 10 ? 1.12 : 0.78;
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
