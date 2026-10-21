// Web Audio API Micro-Sounds - Zero external audio file dependencies
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.lastPianoIdx = -1;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  /**
   * Klangerzeugung beim Tippen: playTypeDroplet(charLength)
   * Web Audio API parametrische Echtzeitsynthese (Physical Modeling eines Tastenklaviers)
   */
  playTypeDroplet(charLength) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      // Skalenquantisierung: C-Dur-Pentatonik (C5 bis E6, 523.25 Hz bis 1318.51 Hz)
      const PENTATONIC = [
        523.25, // C5
        587.33, // D5
        659.25, // E5
        783.99, // G5
        880.00, // A5
        1046.50, // C6
        1174.66, // D6
        1318.51  // E6
      ];

      // Ringspeicher (lastPianoIdx) verhindert unmittelbare Tonwiederholungen
      let noteIdx;
      if (typeof charLength === 'number' && charLength > 0) {
        noteIdx = (charLength - 1) % PENTATONIC.length;
        if (noteIdx === this.lastPianoIdx) {
          noteIdx = (noteIdx + 1) % PENTATONIC.length;
        }
      } else {
        do {
          noteIdx = Math.floor(Math.random() * PENTATONIC.length);
        } while (noteIdx === this.lastPianoIdx && PENTATONIC.length > 1);
      }
      this.lastPianoIdx = noteIdx;
      const f0 = PENTATONIC[noteIdx];
      const now = this.ctx.currentTime;

      // 1. Dynamische Filter-Dämpfung (Subtractive Filter Envelope: Absorption des Holz-Resonanzbodens)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.value = 2.4;
      filter.frequency.setValueAtTime(4200, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

      // 2. ADSR-Amplituden-Hüllkurve (Gain Enveloping für Saitenschwingung)
      const mainGain = this.ctx.createGain();
      mainGain.gain.setValueAtTime(0.0001, now);
      // Attack: Extrem steiler linearer Anstieg über 2.5 ms (verhindert Klick-Artefakte)
      mainGain.gain.linearRampToValueAtTime(0.12, now + 0.0025);
      // Decay & Sustain: Doppelstufiger exponentieller Abfall über 420 ms (0.08 -> 0.026 -> 0.0001)
      mainGain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
      mainGain.gain.exponentialRampToValueAtTime(0.026, now + 0.22);
      mainGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      // Additives Mehr-Oszillatoren-Modell (Harmonic Layering):
      // Layer 1: Grundschwingung (String Fundamental) - Dreieckswelle auf f0
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(f0, now);

      // Layer 2: Obertöne & Saitenchorus (Unison Detune) - Sinus auf Oktave 2 * f0 mit +0.002 Schwebungsverstimmung
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(f0 * 2 * (1 + 0.002), now);

      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.45, now);

      // Layer 3: Hammer-Anschlag-Transiente (Felt Strike Ping) - Sinus auf 3.5 * f0 mit ultrakurzem Envelope (35 ms)
      const osc3 = this.ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(f0 * 3.5, now);

      const pingGain = this.ctx.createGain();
      pingGain.gain.setValueAtTime(0.0001, now);
      pingGain.gain.linearRampToValueAtTime(0.05, now + 0.0015);
      pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      // Audio-Routing
      osc1.connect(filter);
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);
      osc3.connect(pingGain);
      pingGain.connect(filter);

      filter.connect(mainGain);
      mainGain.connect(this.ctx.destination);

      // Start & Stop
      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + 0.43);
      osc2.stop(now + 0.43);
      osc3.stop(now + 0.04);
    } catch {}
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Ignore audio error on locked policy
    }
  }

  playToggle(on = true) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const freq1 = on ? 350 : 550;
      const freq2 = on ? 680 : 280;
      osc.frequency.setValueAtTime(freq1, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq2, this.ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {}
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    } catch {}
  }
}

export const sounds = new SoundEffects();
export const audio = sounds;

if (typeof window !== 'undefined') {
  window.sounds = sounds;
  window.audio = sounds;
}
