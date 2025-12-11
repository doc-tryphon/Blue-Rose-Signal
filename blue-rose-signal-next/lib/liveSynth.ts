// Real-time Live Synthesis Engine
export interface LiveSynthParams {
  // Noise/Spark Controls
  threshold: number      // 0.1-0.9: Connection threshold
  smoothness: number     // 50-2000: Envelope smoothing
  sparkGain: number      // 0-200: Spark intensity
  noiseGain: number      // 0-1: Overall noise level

  // Hum Controls
  humGain: number        // 0-1: 60Hz fundamental
  hum120Gain: number     // 0-1: 120Hz harmonic
  hum180Gain: number     // 0-1: 180Hz harmonic
  hum300Gain: number     // 0-1: 300Hz harmonic

  // Ring Modulation ("Ghost in the Radio")
  ringModEnabled: boolean  // Enable/disable ring modulation
  carrierFreq: number      // 100-3000Hz: Carrier frequency

  // Tape Effects (Wow/Flutter + Saturation)
  wowFlutterDepth: number  // 0-1: Depth of pitch wobble
  saturation: number       // 0-1: Amount of tape saturation

  // Global
  masterVolume: number   // 0-1: Master output
}

export class LiveSynthesizer {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null

  // Oscillators for 60Hz hum + harmonics
  private osc60Hz: OscillatorNode | null = null
  private osc120Hz: OscillatorNode | null = null
  private osc180Hz: OscillatorNode | null = null
  private osc300Hz: OscillatorNode | null = null

  // Gain nodes for volume control
  private humGain: GainNode | null = null
  private osc120Gain: GainNode | null = null
  private osc180Gain: GainNode | null = null
  private osc300Gain: GainNode | null = null

  // Stochastic noise processor
  private noiseWorklet: AudioWorkletNode | null = null
  private noiseGain: GainNode | null = null

  // Ring Modulation ("Ghost in the Radio")
  private carrierOsc: OscillatorNode | null = null
  private ringModGain: GainNode | null = null
  private ringModDry: GainNode | null = null
  private ringModWet: GainNode | null = null

  // Tape Effects (Wow/Flutter + Saturation)
  private tapeDelay: DelayNode | null = null
  private tapeLFO: OscillatorNode | null = null
  private tapeLFOGain: GainNode | null = null
  private tapeSaturation: WaveShaperNode | null = null

  // High-Voltage Arc Chain (parallel spectral processing)
  private arcFilter: BiquadFilterNode | null = null
  private arcShaper: WaveShaperNode | null = null
  private arcGain: GainNode | null = null

  // Master output
  private masterGain: GainNode | null = null

  // Voltage starvation callback
  private envelopeCallback: ((envelope: number, connectionMask: number) => void) | null = null

  private isRunning = false

  // Initialize AudioContext synchronously (required for iOS Safari)
  initializeAudioContext(): AudioContext {
    if (this.audioContext) {
      return this.audioContext
    }

    // CRITICAL: Create AudioContext synchronously for iOS Safari
    this.audioContext = new AudioContext()

    // Create analyser
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = 2048

    // Create master gain (will be set in start())
    this.masterGain = this.audioContext.createGain()
    this.masterGain.gain.value = 1.0 // Will be controlled by masterVolume param
    this.masterGain.connect(this.analyser)
    this.analyser.connect(this.audioContext.destination)

    return this.audioContext
  }

  // Load AudioWorklet asynchronously (after AudioContext is created)
  async loadWorklet(): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized. Call initializeAudioContext() first.')
    }

    // Load the noise processor worklet
    await this.audioContext.audioWorklet.addModule('/noise-processor.js')
  }

  async start(params: LiveSynthParams) {
    if (!this.audioContext || this.isRunning) return

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    // Create 60Hz fundamental + harmonics
    this.osc60Hz = this.audioContext.createOscillator()
    this.osc60Hz.frequency.value = 60
    this.osc60Hz.type = 'sine'

    this.osc120Hz = this.audioContext.createOscillator()
    this.osc120Hz.frequency.value = 120
    this.osc120Hz.type = 'sine'

    this.osc180Hz = this.audioContext.createOscillator()
    this.osc180Hz.frequency.value = 180
    this.osc180Hz.type = 'sine'

    this.osc300Hz = this.audioContext.createOscillator()
    this.osc300Hz.frequency.value = 300
    this.osc300Hz.type = 'sine'

    // Create gain nodes for each harmonic with individual control
    this.humGain = this.audioContext.createGain()
    this.humGain.gain.value = params.humGain

    this.osc120Gain = this.audioContext.createGain()
    this.osc120Gain.gain.value = params.hum120Gain

    this.osc180Gain = this.audioContext.createGain()
    this.osc180Gain.gain.value = params.hum180Gain

    this.osc300Gain = this.audioContext.createGain()
    this.osc300Gain.gain.value = params.hum300Gain

    // Connect oscillators to gains
    this.osc60Hz.connect(this.humGain)
    this.osc120Hz.connect(this.osc120Gain)
    this.osc180Hz.connect(this.osc180Gain)
    this.osc300Hz.connect(this.osc300Gain)

    // Connect all harmonics to master
    this.humGain.connect(this.masterGain!)
    this.osc120Gain.connect(this.masterGain!)
    this.osc180Gain.connect(this.masterGain!)
    this.osc300Gain.connect(this.masterGain!)

    // Create stochastic noise worklet
    this.noiseWorklet = new AudioWorkletNode(this.audioContext, 'noise-processor')

    // Set up envelope data relay for voltage starvation effect
    this.noiseWorklet.port.onmessage = (event) => {
      if (event.data.type === 'envelopeUpdate' && this.envelopeCallback) {
        this.envelopeCallback(event.data.envelope, event.data.connectionMask)
      }
    }

    this.noiseWorklet.port.postMessage({
      type: 'updateParams',
      smoothness: params.smoothness,
      threshold: params.threshold,
      sparkGain: params.sparkGain
    })

    this.noiseGain = this.audioContext.createGain()
    this.noiseGain.gain.value = params.noiseGain

    this.noiseWorklet.connect(this.noiseGain)
    this.noiseGain.connect(this.masterGain!)

    // High-Voltage Arc Chain setup (parallel spectral processing)
    // This adds the "snap" of real electrical arcs without changing core DSP

    // 1. High-Pass Filter: Isolates the "snap" from the "hum"
    this.arcFilter = this.audioContext.createBiquadFilter()
    this.arcFilter.type = 'highpass'
    this.arcFilter.frequency.value = 3000  // Only high frequencies (sizzle)
    this.arcFilter.Q.value = 5.0           // High resonance = "Zap" sound

    // 2. Hard Clipper: Turns soft Gaussian noise into electrical cracks
    this.arcShaper = this.audioContext.createWaveShaper()
    // @ts-ignore - Float32Array typing issue with Web Audio API
    this.arcShaper.curve = this.makeHardClipCurve()
    this.arcShaper.oversample = '4x'

    // 3. Arc Gain: Controls the mix (linked to sparkGain parameter)
    this.arcGain = this.audioContext.createGain()
    this.arcGain.gain.value = Math.min((params.sparkGain / 200) * 0.5, 0.5)

    // Connect the parallel arc chain: Worklet → HPF → Hard Clip → Arc Gain → Master
    // This bypasses tape effects to keep transients sharp!
    this.noiseWorklet.connect(this.arcFilter)
    this.arcFilter.connect(this.arcShaper)
    this.arcShaper.connect(this.arcGain)
    this.arcGain.connect(this.masterGain!)

    // Tape Effects setup (Wow/Flutter + Saturation)
    // Create delay node for wow/flutter effect (pitch wobble)
    this.tapeDelay = this.audioContext.createDelay(0.1) // Max 100ms delay
    this.tapeDelay.delayTime.value = 0.005 // Base delay: 5ms

    // Create LFO for wow/flutter (0.5-3Hz typical for tape)
    this.tapeLFO = this.audioContext.createOscillator()
    this.tapeLFO.frequency.value = 1.5 // 1.5Hz flutter
    this.tapeLFO.type = 'sine'

    // LFO gain controls depth of modulation
    this.tapeLFOGain = this.audioContext.createGain()
    this.tapeLFOGain.gain.value = params.wowFlutterDepth * 0.002 // Scale to 0-2ms modulation

    // Connect LFO to modulate delay time
    this.tapeLFO.connect(this.tapeLFOGain)
    this.tapeLFOGain.connect(this.tapeDelay.delayTime)
    this.tapeLFO.start()

    // Create saturation waveshaper (sigmoid curve for soft clipping)
    this.tapeSaturation = this.audioContext.createWaveShaper()
    // @ts-ignore - Float32Array typing issue with Web Audio API
    this.tapeSaturation.curve = this.makeSaturationCurve(params.saturation)
    this.tapeSaturation.oversample = '4x' // High quality

    // Disconnect master from previous connection
    this.masterGain!.disconnect()

    // Route through tape effects
    this.masterGain!.connect(this.tapeDelay)
    this.tapeDelay.connect(this.tapeSaturation)

    // Ring Modulation setup
    // Create carrier oscillator for ring modulation effect
    this.carrierOsc = this.audioContext.createOscillator()
    this.carrierOsc.frequency.value = params.carrierFreq
    this.carrierOsc.type = 'sine'

    // Create ring mod gain node (carrier will modulate this)
    this.ringModGain = this.audioContext.createGain()
    this.ringModGain.gain.value = 0 // Carrier will set this

    // Connect carrier to modulate the ring mod gain
    this.carrierOsc.connect(this.ringModGain.gain)
    this.carrierOsc.start()

    // Create dry/wet mix gains for ring mod
    this.ringModDry = this.audioContext.createGain()
    this.ringModWet = this.audioContext.createGain()

    // Connect tape saturation output to both dry and wet paths
    this.tapeSaturation.connect(this.ringModDry)
    this.tapeSaturation.connect(this.ringModWet)

    // Wet path goes through ring modulation
    this.ringModWet.connect(this.ringModGain)
    this.ringModGain.connect(this.analyser!)

    // Dry path bypasses ring mod
    this.ringModDry.connect(this.analyser!)

    // Set initial dry/wet based on ringModEnabled
    if (params.ringModEnabled) {
      this.ringModDry.gain.value = 0.3  // Small amount of dry for blend
      this.ringModWet.gain.value = 0.7  // Mostly wet
    } else {
      this.ringModDry.gain.value = 1.0  // All dry
      this.ringModWet.gain.value = 0.0  // No wet
    }

    // Set master volume
    this.masterGain!.gain.value = params.masterVolume

    // Start oscillators
    this.osc60Hz.start()
    this.osc120Hz.start()
    this.osc180Hz.start()
    this.osc300Hz.start()

    this.isRunning = true
  }

  stop() {
    if (!this.isRunning) return

    // Stop and disconnect oscillators
    this.osc60Hz?.stop()
    this.osc120Hz?.stop()
    this.osc180Hz?.stop()
    this.osc300Hz?.stop()

    this.osc60Hz?.disconnect()
    this.osc120Hz?.disconnect()
    this.osc180Hz?.disconnect()
    this.osc300Hz?.disconnect()

    // Disconnect gains
    this.humGain?.disconnect()
    this.osc120Gain?.disconnect()
    this.osc180Gain?.disconnect()
    this.osc300Gain?.disconnect()

    // Disconnect noise
    this.noiseWorklet?.disconnect()
    this.noiseGain?.disconnect()

    // Disconnect tape effects
    this.tapeLFO?.stop()
    this.tapeLFO?.disconnect()
    this.tapeLFOGain?.disconnect()
    this.tapeDelay?.disconnect()
    this.tapeSaturation?.disconnect()

    // Disconnect ring modulation
    this.carrierOsc?.stop()
    this.carrierOsc?.disconnect()
    this.ringModGain?.disconnect()
    this.ringModDry?.disconnect()
    this.ringModWet?.disconnect()

    // Disconnect arc chain
    this.arcFilter?.disconnect()
    this.arcShaper?.disconnect()
    this.arcGain?.disconnect()

    // Clean up
    this.osc60Hz = null
    this.osc120Hz = null
    this.osc180Hz = null
    this.osc300Hz = null
    this.humGain = null
    this.osc120Gain = null
    this.osc180Gain = null
    this.osc300Gain = null
    this.noiseWorklet = null
    this.noiseGain = null
    this.tapeDelay = null
    this.tapeLFO = null
    this.tapeLFOGain = null
    this.tapeSaturation = null
    this.carrierOsc = null
    this.ringModGain = null
    this.ringModDry = null
    this.ringModWet = null
    this.arcFilter = null
    this.arcShaper = null
    this.arcGain = null

    this.isRunning = false
  }

  updateParams(params: LiveSynthParams) {
    if (!this.isRunning) return

    const now = this.audioContext!.currentTime
    const rampTime = now + 0.05

    // Update hum volumes with smooth ramping to avoid clicks
    this.humGain?.gain.linearRampToValueAtTime(params.humGain, rampTime)
    this.osc120Gain?.gain.linearRampToValueAtTime(params.hum120Gain, rampTime)
    this.osc180Gain?.gain.linearRampToValueAtTime(params.hum180Gain, rampTime)
    this.osc300Gain?.gain.linearRampToValueAtTime(params.hum300Gain, rampTime)

    // Update noise gain
    this.noiseGain?.gain.linearRampToValueAtTime(params.noiseGain, rampTime)

    // Update master volume
    this.masterGain?.gain.linearRampToValueAtTime(params.masterVolume, rampTime)

    // Update tape effects
    if (this.tapeLFOGain) {
      // Update wow/flutter depth (0-2ms modulation range)
      this.tapeLFOGain.gain.linearRampToValueAtTime(params.wowFlutterDepth * 0.002, rampTime)
    }

    if (this.tapeSaturation) {
      // Update saturation curve
      // @ts-ignore - Float32Array typing issue with Web Audio API
      this.tapeSaturation.curve = this.makeSaturationCurve(params.saturation)
    }

    // Update ring modulation
    if (this.carrierOsc) {
      this.carrierOsc.frequency.linearRampToValueAtTime(params.carrierFreq, rampTime)
    }

    // Update ring mod dry/wet mix
    if (this.ringModDry && this.ringModWet) {
      if (params.ringModEnabled) {
        this.ringModDry.gain.linearRampToValueAtTime(0.3, rampTime)
        this.ringModWet.gain.linearRampToValueAtTime(0.7, rampTime)
      } else {
        this.ringModDry.gain.linearRampToValueAtTime(1.0, rampTime)
        this.ringModWet.gain.linearRampToValueAtTime(0.0, rampTime)
      }
    }

    // Update noise processor parameters
    if (this.noiseWorklet) {
      this.noiseWorklet.port.postMessage({
        type: 'updateParams',
        smoothness: params.smoothness,
        threshold: params.threshold,
        sparkGain: params.sparkGain
      })
    }

    // Update arc gain (linked to sparkGain parameter)
    // This controls the intensity of the electrical "snap" effect
    if (this.arcGain) {
      const arcVolume = Math.min((params.sparkGain / 200) * 0.5, 0.5)
      this.arcGain.gain.linearRampToValueAtTime(arcVolume, rampTime)
    }
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext
  }

  getIsRunning(): boolean {
    return this.isRunning
  }

  setEnvelopeCallback(callback: (envelope: number, connectionMask: number) => void) {
    this.envelopeCallback = callback
  }

  // Helper: Generate waveshaper curve for tape saturation (sigmoid)
  private makeSaturationCurve(amount: number): Float32Array {
    const samples = 1024
    const curve = new Float32Array(samples)

    // CRITICAL FIX: If amount is essentially 0, return a linear (identity) curve
    // Otherwise, tanh(0) = 0 creates a flat zero curve that mutes all audio
    if (amount < 0.01) {
      for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1 // Range: -1 to 1
        curve[i] = x // Linear: Input equals Output (audio passes through)
      }
      return curve
    }

    const deg = Math.PI / 180
    const drive = amount * 50 // Scale 0-1 to 0-50 for saturation intensity

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1 // Range: -1 to 1
      // Sigmoid curve: tanh for soft clipping
      curve[i] = (Math.exp(drive * x * deg) - Math.exp(-drive * x * deg)) /
                  (Math.exp(drive * x * deg) + Math.exp(-drive * x * deg))
    }

    return curve
  }

  // Helper: Generate hard clipping curve for electrical arc effect
  private makeHardClipCurve(): Float32Array {
    const samples = 1024
    const curve = new Float32Array(samples)

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1 // Range: -1 to 1

      // Hard clipping: Creates square-wave transients (electrical "snap")
      // If > 0.5, output 1.0. If < -0.5, output -1.0
      // This turns Gaussian spikes into flat-topped squares
      if (x > 0.5) {
        curve[i] = 1.0
      } else if (x < -0.5) {
        curve[i] = -1.0
      } else {
        curve[i] = x * 2 // Steep linear slope in middle
      }
    }

    return curve
  }
}
