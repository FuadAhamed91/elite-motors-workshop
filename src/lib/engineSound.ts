/**
 * Synthesized F1 start sequence built with the Web Audio API — no audio file
 * required. Everything is scheduled on the audio clock from a single call so
 * the sound stays in sync with the visual timeline even when the visitor taps
 * for sound part-way through:
 *
 *   • a tick as each start light comes on
 *   • a low idle burble that tightens as the lights build (anticipation)
 *   • at lights-out, an engine pass: revs through three gear shifts, peaks as
 *     the car passes the camera, then drops (Doppler) and fades
 */
import { lightsOutMs, type IntroTimeline } from '@/config/intro'

let sharedContext: AudioContext | null = null

type WindowWithWebkitAudio = Window & { webkitAudioContext?: typeof AudioContext }

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext
  if (!Ctor) return null
  sharedContext ??= new Ctor()
  return sharedContext
}

/**
 * Resolves true when audio may play right now. Browsers keep the context
 * suspended until the page has had a user gesture, so this only succeeds
 * after the visitor has already interacted with the site.
 */
export async function tryUnlockAudio(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && 'userActivation' in navigator) {
    const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } })
      .userActivation
    if (activation && !activation.hasBeenActive) return false
  }
  const ctx = getAudioContext()
  if (!ctx) return false
  if (ctx.state === 'running') return true
  try {
    await Promise.race([
      ctx.resume(),
      new Promise((_, reject) => window.setTimeout(reject, 250)),
    ])
  } catch {
    return false
  }
  // `resume()` may have changed the state — re-read it rather than trusting the narrowed type.
  return (ctx.state as AudioContextState) === 'running'
}

const MIN_GAIN = 0.0001 // exponential ramps cannot reach zero

function distortionCurve(amount: number): Float32Array<ArrayBuffer> {
  const samples = 512
  const curve = new Float32Array(samples)
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1
    curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x))
  }
  return curve
}

function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = Math.ceil(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

/** Short, soft tick used when a start light comes on. */
function scheduleTick(ctx: AudioContext, out: AudioNode, at: number) {
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(660, at)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(MIN_GAIN, at)
  gain.gain.exponentialRampToValueAtTime(0.14, at + 0.006)
  gain.gain.exponentialRampToValueAtTime(MIN_GAIN, at + 0.09)
  osc.connect(gain).connect(out)
  osc.start(at)
  osc.stop(at + 0.1)
}

/** Idle burble while the car waits on the grid, tightening towards lights-out. */
function scheduleIdle(ctx: AudioContext, out: AudioNode, from: number, until: number) {
  if (until <= from + 0.05) return
  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 320
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(MIN_GAIN, from)
  gain.gain.exponentialRampToValueAtTime(0.16, from + 0.2)
  gain.gain.setValueAtTime(0.16, until - 0.05)
  gain.gain.exponentialRampToValueAtTime(MIN_GAIN, until + 0.02)
  lowpass.connect(gain).connect(out)

  // tremolo gives the lumpy idle character
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 11
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.35
  lfo.connect(lfoGain).connect(gain.gain)
  lfo.start(from)
  lfo.stop(until + 0.05)

  const voices: Array<{ type: OscillatorType; ratio: number; gain: number }> = [
    { type: 'sawtooth', ratio: 1, gain: 0.5 },
    { type: 'square', ratio: 2, gain: 0.12 },
    { type: 'sine', ratio: 0.5, gain: 0.4 },
  ]
  for (const voice of voices) {
    const osc = ctx.createOscillator()
    osc.type = voice.type
    osc.frequency.setValueAtTime(58 * voice.ratio, from)
    osc.frequency.exponentialRampToValueAtTime(82 * voice.ratio, until)
    const g = ctx.createGain()
    g.gain.value = voice.gain
    osc.connect(g).connect(lowpass)
    osc.start(from)
    osc.stop(until + 0.05)
  }
}

interface Voice {
  type: OscillatorType
  ratio: number
  gain: number
}

const PASS_VOICES: readonly Voice[] = [
  { type: 'sawtooth', ratio: 1, gain: 0.5 },
  { type: 'square', ratio: 2, gain: 0.16 },
  { type: 'sawtooth', ratio: 3, gain: 0.1 },
  { type: 'sine', ratio: 0.5, gain: 0.35 },
]

/** Engine pass: launch, three gear shifts, peak at the camera, Doppler drop. */
function scheduleEnginePass(ctx: AudioContext, out: AudioNode, t0: number, total: number) {
  const passAt = total * 0.55 // moment the car passes the camera
  const baseHz = 75
  const peakHz = 540
  const shiftPoints = [0.24, 0.44, 0.62] // fractions of `passAt` where gears change

  const master = ctx.createGain()
  master.gain.setValueAtTime(MIN_GAIN, t0)
  master.gain.exponentialRampToValueAtTime(0.32, t0 + 0.08)
  master.gain.exponentialRampToValueAtTime(0.5, t0 + passAt)
  master.gain.exponentialRampToValueAtTime(MIN_GAIN, t0 + total)
  master.connect(out)

  const shaper = ctx.createWaveShaper()
  shaper.curve = distortionCurve(60)
  shaper.oversample = '2x'
  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.Q.value = 4
  lowpass.frequency.setValueAtTime(360, t0)
  lowpass.frequency.exponentialRampToValueAtTime(4200, t0 + passAt)
  lowpass.frequency.exponentialRampToValueAtTime(700, t0 + total)
  shaper.connect(lowpass).connect(master)

  const segmentEnds = [...shiftPoints.map((p) => p * passAt), passAt]
  for (const voice of PASS_VOICES) {
    const osc = ctx.createOscillator()
    osc.type = voice.type
    const gain = ctx.createGain()
    gain.gain.value = voice.gain
    osc.connect(gain).connect(shaper)

    const freq = osc.frequency
    freq.setValueAtTime(baseHz * voice.ratio, t0)
    segmentEnds.forEach((end, index) => {
      const target = baseHz + (peakHz - baseHz) * ((index + 1) / segmentEnds.length)
      freq.exponentialRampToValueAtTime(target * voice.ratio, t0 + end)
      if (index < shiftPoints.length) {
        // gear change: quick drop, then keep climbing
        freq.setValueAtTime(target * 0.72 * voice.ratio, t0 + end + 0.04)
      }
    })
    freq.exponentialRampToValueAtTime(peakHz * 0.5 * voice.ratio, t0 + total)
    osc.start(t0)
    osc.stop(t0 + total + 0.1)
  }

  // Air rush that swells as the car goes by
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer(ctx, total + 0.2)
  const bandpass = ctx.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 1400
  bandpass.Q.value = 0.8
  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(MIN_GAIN, t0)
  noiseGain.gain.exponentialRampToValueAtTime(0.05, t0 + passAt * 0.7)
  noiseGain.gain.exponentialRampToValueAtTime(0.35, t0 + passAt)
  noiseGain.gain.exponentialRampToValueAtTime(MIN_GAIN, t0 + total)
  noise.connect(bandpass).connect(noiseGain).connect(master)
  noise.start(t0)
  noise.stop(t0 + total + 0.2)
}

/**
 * Schedules the whole start sequence relative to `elapsedMs` (how far the
 * visual timeline has already progressed), so tapping for sound late still
 * lines up. Returns a function that fades everything out early.
 */
export function playIntroSound(
  ctx: AudioContext,
  timeline: IntroTimeline,
  elapsedMs: number,
): () => void {
  const now = ctx.currentTime
  const at = (ms: number) => now + Math.max(0, (ms - elapsedMs) / 1000)

  const master = ctx.createGain()
  master.gain.value = 0.9
  const compressor = ctx.createDynamicsCompressor()
  compressor.threshold.value = -18
  compressor.ratio.value = 6
  master.connect(compressor).connect(ctx.destination)

  for (let i = 0; i < timeline.lightCount; i++) {
    const lightMs = timeline.lightsStartMs + i * timeline.lightIntervalMs
    if (lightMs >= elapsedMs) scheduleTick(ctx, master, at(lightMs))
  }

  const launchMs = lightsOutMs(timeline)
  if (elapsedMs < launchMs) scheduleIdle(ctx, master, now, at(launchMs))

  // If the car has already launched, compress the pass into the time that is left.
  const remainingRace = (launchMs + timeline.raceMs - elapsedMs) / 1000
  const passDuration = elapsedMs > launchMs ? Math.max(0.6, remainingRace) : timeline.raceMs / 1000
  scheduleEnginePass(ctx, master, at(launchMs), passDuration)

  return () => {
    const t = ctx.currentTime
    master.gain.cancelScheduledValues(t)
    master.gain.setTargetAtTime(MIN_GAIN, t, 0.05)
  }
}

/** Plays a licensed clip instead of the synth, from the given offset. Returns a stop function. */
export function playAudioFile(url: string, offsetMs = 0): () => void {
  const audio = new Audio(url)
  audio.volume = 0.8
  audio.currentTime = offsetMs / 1000
  void audio.play().catch(() => undefined)
  return () => {
    audio.pause()
    audio.currentTime = 0
  }
}
