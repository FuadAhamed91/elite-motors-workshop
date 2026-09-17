/**
 * Synthesized F1-style engine pass built with the Web Audio API — no audio
 * file required. Stacked saw/square oscillators run through soft distortion
 * and a sweeping low-pass filter; the pitch revs through three "gear shifts",
 * peaks as the car passes the camera, then drops (Doppler) and fades out.
 */

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
 * on repeat visits / after interaction.
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

const MIN_GAIN = 0.0001 // exponential ramps cannot reach zero

interface Voice {
  type: OscillatorType
  ratio: number
  gain: number
}

const VOICES: readonly Voice[] = [
  { type: 'sawtooth', ratio: 1, gain: 0.5 },
  { type: 'square', ratio: 2, gain: 0.16 },
  { type: 'sawtooth', ratio: 3, gain: 0.1 },
  { type: 'sine', ratio: 0.5, gain: 0.35 },
]

/** Plays one engine pass. Returns a function that fades it out early. */
export function playEnginePass(ctx: AudioContext, durationMs = 2200): () => void {
  const t0 = ctx.currentTime
  const total = durationMs / 1000
  const passAt = total * 0.62 // moment the car passes the camera
  const baseHz = 70
  const peakHz = 520
  const shiftPoints = [0.22, 0.4, 0.56] // fractions of `passAt` where gears change

  const master = ctx.createGain()
  master.gain.setValueAtTime(MIN_GAIN, t0)
  const compressor = ctx.createDynamicsCompressor()
  compressor.threshold.value = -18
  compressor.ratio.value = 6
  master.connect(compressor).connect(ctx.destination)

  const shaper = ctx.createWaveShaper()
  shaper.curve = distortionCurve(60)
  shaper.oversample = '2x'
  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.Q.value = 4
  shaper.connect(lowpass).connect(master)

  const segmentEnds = [...shiftPoints.map((p) => p * passAt), passAt]
  for (const voice of VOICES) {
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
    // Doppler drop once the car is past
    freq.exponentialRampToValueAtTime(peakHz * 0.55 * voice.ratio, t0 + total)
    osc.start(t0)
    osc.stop(t0 + total + 0.1)
  }

  lowpass.frequency.setValueAtTime(320, t0)
  lowpass.frequency.exponentialRampToValueAtTime(3800, t0 + passAt)
  lowpass.frequency.exponentialRampToValueAtTime(700, t0 + total)

  master.gain.exponentialRampToValueAtTime(0.18, t0 + 0.12)
  master.gain.exponentialRampToValueAtTime(0.42, t0 + passAt)
  master.gain.exponentialRampToValueAtTime(MIN_GAIN, t0 + total)

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

  return () => {
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setTargetAtTime(MIN_GAIN, now, 0.05)
  }
}

/** Plays a licensed audio file instead of the synth. Returns a stop function. */
export function playAudioFile(url: string): () => void {
  const audio = new Audio(url)
  audio.volume = 0.8
  void audio.play().catch(() => undefined)
  return () => {
    audio.pause()
    audio.currentTime = 0
  }
}
