/**
 * Lightweight Audio Engine - Web Audio API
 * For UI sounds: hover, click, ambient water sounds
 */

class AudioEngine {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.buffers = new Map()
    this.unlocked = false
    this.ambientSource = null
    this.ambientGain = null
  }

  init() {
    if (this.ctx) return
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    this.masterGain = this.ctx.createGain()
    this.masterGain.connect(this.ctx.destination)
    this.masterGain.gain.value = 0.3

    this.ambientGain = this.ctx.createGain()
    this.ambientGain.connect(this.masterGain)
    this.ambientGain.gain.value = 0
  }

  async unlock() {
    if (this.unlocked) return
    this.init()
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }
    this.unlocked = true
  }

  async load(name, url) {
    this.init()
    try {
      const res = await fetch(url)
      const arrayBuffer = await res.arrayBuffer()
      const buffer = await this.ctx.decodeAudioData(arrayBuffer)
      this.buffers.set(name, buffer)
    } catch (e) {
      console.warn(`[Audio] Failed to load ${name}:`, e)
    }
  }

  play(name, { volume = 1, rate = 1, loop = false } = {}) {
    if (!this.unlocked || !this.ctx || !this.buffers.has(name)) return
    const buffer = this.buffers.get(name)
    const source = this.ctx.createBufferSource()
    const gain = this.ctx.createGain()
    source.buffer = buffer
    source.playbackRate.value = rate
    source.loop = loop
    gain.gain.value = volume
    source.connect(gain)
    gain.connect(this.masterGain)
    source.start(0)
    return { source, gain, stop: () => source.stop() }
  }

  // Generate synthetic water drop sound
  waterDrop({ volume = 0.3, pitch = 1 } = {}) {
    if (!this.unlocked || !this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800 * pitch, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200 * pitch, this.ctx.currentTime + 0.15)

    filter.type = 'lowpass'
    filter.frequency.value = 2000
    filter.Q.value = 2

    gain.gain.setValueAtTime(volume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.3)
  }

  // Generate synthetic bubble pop
  bubblePop({ volume = 0.2 } = {}) {
    if (!this.unlocked || !this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(volume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.12)
  }

  // Ambient water flow
  startAmbient() {
    if (!this.unlocked || !this.ctx || this.ambientSource) return
    // Create noise-based water sound
    const bufferSize = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.5))
    }

    this.ambientSource = this.ctx.createBufferSource()
    this.ambientSource.buffer = buffer
    this.ambientSource.loop = true
    this.ambientSource.connect(this.ambientGain)
    this.ambientSource.start()

    // Fade in
    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime)
    this.ambientGain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 3)
  }

  stopAmbient() {
    if (!this.ambientSource) return
    const ctx = this.ctx
    this.ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2)
    setTimeout(() => {
      this.ambientSource.stop()
      this.ambientSource = null
    }, 2500)
  }

  setMasterVolume(vol) {
    if (this.masterGain) this.masterGain.gain.value = Math.max(0, Math.min(1, vol))
  }
}

export const audio = new AudioEngine()