/**
 * Shared Web Speech + Web Audio helpers for Know Your Health mini-games.
 */

export type SpeakOptions = {
  onEnd?: () => void;
  onStart?: () => void;
  /** Hold a module-level utterance ref + delay after cancel (Chrome GC workaround). */
  keepAlive?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
  logErrors?: boolean;
  /**
   * When `speechSynthesis` is missing and `onEnd` is set, delay before calling `onEnd` (ms).
   * BrainHealth used 100ms; BodyImage used 0.
   */
  noTtsOnEndDelayMs?: number;
};

let _utterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, options?: SpeakOptions): void {
  const {
    onEnd,
    onStart,
    keepAlive = false,
    rate = 0.9,
    pitch = 1.05,
    volume = 1,
    logErrors = false,
    noTtsOnEndDelayMs = 0,
  } = options ?? {};

  if (!("speechSynthesis" in window)) {
    if (onEnd) {
      if (noTtsOnEndDelayMs > 0) setTimeout(onEnd, noTtsOnEndDelayMs);
      else onEnd();
    }
    return;
  }

  if (keepAlive) {
    try {
      window.speechSynthesis.cancel();
      _utterance = null;
      setTimeout(() => {
        try {
          const u = new SpeechSynthesisUtterance(text);
          _utterance = u;
          u.rate = rate;
          u.pitch = pitch;
          u.volume = volume;
          u.onstart = () => onStart?.();
          u.onend = () => {
            if (_utterance === u) _utterance = null;
            onEnd?.();
          };
          u.onerror = (e) => {
            if (logErrors) console.warn("TTS error:", e.error);
            if (_utterance === u) _utterance = null;
            onEnd?.();
          };
          window.speechSynthesis.speak(u);
        } catch (e) {
          if (logErrors) console.warn("TTS exception:", e);
          onEnd?.();
        }
      }, 100);
    } catch (e) {
      if (logErrors) console.warn("TTS outer exception:", e);
      onEnd?.();
    }
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export function playCorrect(): void {
  try {
    const ctx = new AudioContext();
    [[523, 0], [659, 0.15], [784, 0.3]].forEach(([freq, delay]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.35);
    });
    setTimeout(() => void ctx.close(), 1000);
  } catch {
    /* ignore */
  }
}

export function playWrong(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    setTimeout(() => void ctx.close(), 700);
  } catch {
    /* ignore */
  }
}
