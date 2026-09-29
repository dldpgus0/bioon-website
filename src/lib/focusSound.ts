// Focus sounds generated in the browser with the Web Audio API: no audio files and no music
// licensing. Each sound is a small node graph feeding one master gain for volume and fades.

export type SoundId = "off" | "brown" | "rain" | "ambient";

function noiseBuffer(ctx: AudioContext, kind: "brown" | "white", seconds = 4) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    if (kind === "brown") {
      // Integrated (random-walk) noise: deep and soft.
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    } else {
      data[i] = white;
    }
  }
  return buf;
}

export class FocusSound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private sources: (AudioBufferSourceNode | OscillatorNode)[] = [];
  private volume = 0.5;

  private ensure() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return { ctx: this.ctx, master: this.master! };
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.ctx && this.master && this.sources.length) {
      this.master.gain.setTargetAtTime(v * 0.6, this.ctx.currentTime, 0.1);
    }
  }

  /** Starts a sound (replacing any current one) with a short fade-in. Call from a click handler. */
  play(id: SoundId) {
    this.stop(0);
    if (id === "off") return;
    const { ctx, master } = this.ensure();

    if (id === "brown" || id === "rain") {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx, id === "brown" ? "brown" : "white");
      src.loop = true;
      let out: AudioNode = src;
      if (id === "rain") {
        // Band-limited white noise with a slow wobble reads as steady rain.
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 900;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 7000;
        const wobble = ctx.createGain();
        wobble.gain.value = 0.35;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.15;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.08;
        lfo.connect(lfoGain).connect(wobble.gain);
        src.connect(hp).connect(lp).connect(wobble);
        out = wobble;
        lfo.start();
        this.sources.push(lfo);
        this.nodes.push(hp, lp, wobble, lfoGain);
      }
      out.connect(master);
      src.start();
      this.sources.push(src);
    } else {
      // Ambient: a soft A-major pad with slow breathing.
      const pad = ctx.createGain();
      pad.gain.value = 0.12;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1200;
      pad.connect(lp).connect(master);
      for (const [freq, detune] of [
        [110, 0],
        [164.81, 4],
        [220, -3],
        [277.18, 2],
      ]) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.detune.value = detune;
        osc.connect(pad);
        osc.start();
        this.sources.push(osc);
      }
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.07;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.05;
      lfo.connect(lfoGain).connect(pad.gain);
      lfo.start();
      this.sources.push(lfo);
      this.nodes.push(pad, lp, lfoGain);
    }
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(this.volume * 0.6, ctx.currentTime + 1.5);
  }

  /** Fades out and stops whatever is playing. */
  stop(fadeSeconds = 0.8) {
    if (!this.ctx || !this.master) return;
    const { ctx, master } = this;
    const sources = this.sources;
    const nodes = this.nodes;
    this.sources = [];
    this.nodes = [];
    const end = ctx.currentTime + fadeSeconds;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, end);
    for (const s of sources) {
      try {
        s.stop(end + 0.05);
      } catch {}
    }
    setTimeout(() => nodes.forEach((n) => n.disconnect()), (fadeSeconds + 0.1) * 1000);
  }

  /** Two soft notes to mark the end of a phase. */
  chime() {
    const { ctx } = this.ensure();
    [880, 1318.5].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = f;
      const t = ctx.currentTime + i * 0.25;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.3);
    });
  }

  close() {
    this.stop(0);
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}
