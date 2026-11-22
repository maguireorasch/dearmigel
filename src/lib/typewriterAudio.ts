const SONG_URL = '/assets/aistudio/LeeHi_-_ONLY__Lyrics__53865da8.mp3';

class VintageTypewriterAudio {
  private ctx: AudioContext | null = null;
  private musicMasterGain: GainNode | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  private musicPlaying = false;
  private musicVolume = 0.55;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this.musicMasterGain && this.ctx) {
      this.musicMasterGain = this.ctx.createGain();
      this.musicMasterGain.gain.setValueAtTime(
        this.musicVolume,
        this.ctx.currentTime
      );
      this.musicMasterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private ensureAudioElement(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.bgAudio) {
      const audio = new Audio(SONG_URL);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = this.musicVolume;
      this.bgAudio = audio;
    }
    return this.bgAudio;
  }

  public setVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.bgAudio) {
      this.bgAudio.volume = this.musicVolume;
    }
    if (this.ctx && this.musicMasterGain) {
      this.musicMasterGain.gain.setTargetAtTime(
        this.musicVolume,
        this.ctx.currentTime,
        0.05
      );
    }
  }

  public getVolume(): number {
    return this.musicVolume;
  }

  public isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  public toggleMusic(): boolean {
    if (this.musicPlaying) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.musicPlaying;
  }

  /** Play uploaded romantic song (LeeHi - ONLY) on loop */
  public startMusic(): void {
    if (this.musicPlaying) return;
    const audio = this.ensureAudioElement();
    if (!audio) return;

    audio.volume = this.musicVolume;
    this.musicPlaying = true;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        this.musicPlaying = false;
      });
    }
  }

  public stopMusic(): void {
    this.musicPlaying = false;
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
  }

  /** Metallic golden coin drop + mechanical unlock clink */
  public playCoinInsert(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Two crisp high metallic clinks
    [1860, 2420].forEach((freq, idx) => {
      const t = now + idx * 0.085;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.96, t + 0.28);
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    });

    // Mechanical latch clunk
    const latch = ctx.createOscillator();
    const latchGain = ctx.createGain();
    latch.type = 'triangle';
    latch.frequency.setValueAtTime(145, now + 0.2);
    latch.frequency.exponentialRampToValueAtTime(75, now + 0.32);
    latchGain.gain.setValueAtTime(0.11, now + 0.2);
    latchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
    latch.connect(latchGain);
    latchGain.connect(ctx.destination);
    latch.start(now + 0.2);
    latch.stop(now + 0.36);
  }

  /** Authentic vintage mechanical key strike clack */
  public playKeyClack(isSpace = false): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Short percussive filtered click
    const bufferSize = Math.floor(ctx.sampleRate * 0.028);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(isSpace ? 950 : 1950 + Math.random() * 350, now);
    bandpass.Q.setValueAtTime(1.8, now);

    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(isSpace ? 0.14 : 0.11, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

    noise.connect(bandpass);
    bandpass.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(now);

    // Subtle mechanical body thud
    const body = ctx.createOscillator();
    const bGain = ctx.createGain();
    body.type = 'triangle';
    body.frequency.setValueAtTime(isSpace ? 130 : 210 + Math.random() * 40, now);
    body.frequency.exponentialRampToValueAtTime(65, now + 0.03);
    bGain.gain.setValueAtTime(0.06, now);
    bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.032);
    body.connect(bGain);
    bGain.connect(ctx.destination);
    body.start(now);
    body.stop(now + 0.035);
  }

  /** Crisp brass typewriter bell at end of line */
  public playBellDing(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [2240, 4480].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(i === 0 ? 0.08 : 0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.65);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.68);
    });
  }

  /** Mechanical carriage return zip */
  public playCarriageReturn(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(290, now + 0.14);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /** Warm romantic chime for heart burst & envelope */
  public playRomanticChime(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 987.77, 1318.5].forEach((freq, idx) => {
      const t = now + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.065, t);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.58);
    });
  }
}

export const typewriterAudio = new VintageTypewriterAudio();
