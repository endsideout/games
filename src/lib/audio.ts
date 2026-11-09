// Shared audio
// One "voice channel" for mascot clips and text-to-speech


// This type is used for the callback a game passes in when a voice entry finishes.
// The interrupted argument tells it why it's finished.
type EndHandler = (interrupted: boolean) => void;

interface VoiceEntry { 
  stop: () => void;
  end:  (interrupted: boolean) => void;
} 

interface SpeakOptions {
  rate?:    number;
  pitch?:   number;
  voice?:   SpeechSynthesisVoice | null;
  onStart?: () => void;
}

let current: VoiceEntry | null = null;
let keepAlive: SpeechSynthesisUtterance | null = null; // keep-alive: prevents Chrome GC bug

export function stopVoice() {
  const entry = current;
  current = null;
  entry?.stop();
  entry?.end(true);
}

// Claims the channel. onEnd fires exactly once — interrupted=true if something else took over.
function claim(stop: () => void, onEnd?: EndHandler): VoiceEntry {
  stopVoice();
  let ended = false;
  const entry: VoiceEntry = { 
    stop,
    end: (interrupted) => {
      if (ended) return;
      ended = true;
      if (current === entry) current = null;
      onEnd?.(interrupted);
    },
  };
  current = entry;
  return entry;
}

export function speak(text: string, onEnd?: EndHandler, opts: SpeakOptions = {}) {
  if (!("speechSynthesis" in window)) {
    // No TTS support — fire callback anyway so the game still advances
    setTimeout(() => onEnd?.(false), 100);
    return;
  }
  try {
    const synth = window.speechSynthesis;
    const busy  = synth.speaking || synth.pending;
    const entry = claim(() => synth.cancel(), onEnd);
    if (busy) synth.cancel();

    const start = () => {
      if (current !== entry) return; // stopped or replaced during the delay
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.rate   = opts.rate  ?? 0.85;
        u.pitch  = opts.pitch ?? 1.10;
        u.volume = 1;
        if (opts.voice) u.voice = opts.voice;
        keepAlive = u;
        u.onstart = () => opts.onStart?.();
        u.onend   = () => { if (keepAlive === u) keepAlive = null; entry.end(false); };
        u.onerror = () => { if (keepAlive === u) keepAlive = null; entry.end(false); };
        synth.speak(u);
      } catch (_) { entry.end(false); }
    };

    // Chrome can silently drop an utterance queued right after cancel(), so wait a tick
    if (busy) setTimeout(start, 100);
    else start();
  } catch (_) { onEnd?.(false); }
}

// Holds the channel during a gap, so anything that starts meanwhile cancels what follows
function pause(ms: number, next: () => void, onInterrupt?: EndHandler) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const entry = claim(() => clearTimeout(timer), (interrupted) => { if (interrupted) onInterrupt?.(true); });
  timer = setTimeout(() => { entry.end(false); next(); }, ms);
}

// Speaks each part in order with a pause between them. If anything interrupts,
// the remaining parts are dropped and onEnd(true) fires.
export function speakSequence(parts: string[], pauseMs: number, onEnd?: EndHandler, opts: SpeakOptions = {}) {
  const [first, ...rest] = parts;
  if (first === undefined) { onEnd?.(false); return; }
  speak(first, (interrupted) => {
    if (interrupted || rest.length === 0) { onEnd?.(interrupted); return; }
    pause(pauseMs, () => speakSequence(rest, pauseMs, onEnd, opts), onEnd);
  }, opts);
}

// Friendly English voice if the browser exposes one (some privacy browsers return none)
export function getPreferredVoice(): SpeechSynthesisVoice | null {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("samantha"))
    ?? voices.find(v => v.lang.startsWith("en") && !v.name.toLowerCase().includes("compact"))
    ?? voices.find(v => v.lang.startsWith("en"))
    ?? null;
}

export function playClip(src: string, opts: { onStart?: () => void; onEnd?: EndHandler } = {}) {
  const audio = new Audio(src);
  const entry = claim(() => { audio.pause(); audio.currentTime = 0; }, opts.onEnd);
  audio.onplay  = () => opts.onStart?.();
  audio.onended = () => entry.end(false);
  audio.onerror = () => entry.end(false);
  audio.play().catch(() => entry.end(false));
}

// ── Sound effects (Web Audio API) ─────────────────────────────────────────────
let ctx: AudioContext | null = null;

function tone(freq: number, delay: number, length: number, type: OscillatorType, volume: number, endFreq?: number) {
  try {
    ctx ??= new AudioContext();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime + delay;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + length);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + length);
    osc.start(t);
    osc.stop(t + length);
  } catch (_) {}
}

// Plays notes one after another, `spacing` seconds apart
export function playNotes(freqs: number[], type: OscillatorType = "sine", spacing = 0.13) {
  freqs.forEach((freq, i) => tone(freq, i * spacing, 0.28, type, 0.28));
}

// Three ascending notes: C5 → E5 → G5
export function playCorrect() {
  [[523, 0], [659, 0.15], [784, 0.3]].forEach(([freq, delay]) => tone(freq, delay, 0.3, "sine", 0.3));
}

// Falling buzz
export function playWrong() {
  tone(300, 0, 0.4, "sawtooth", 0.25, 150);
}
