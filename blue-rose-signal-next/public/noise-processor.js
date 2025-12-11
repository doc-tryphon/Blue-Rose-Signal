// AudioWorklet processor for stochastic noise generation
// Faithful recreation of the original Python DSP algorithm
class NoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.smoothness = 500
    this.threshold = 0.6
    this.sparkGain = 50.0

    // Envelope smoothing buffer (implements moving average like np.convolve)
    this.envelopeBuffer = []
    this.envelope = 0
    this.lastEnvelope = 0

    // Voltage starvation: send envelope data to main thread for CRT flicker
    this.frameCount = 0
    this.sendInterval = 128 // Send every 128 samples (~2.67ms at 48kHz, 375fps)

    this.port.onmessage = (e) => {
      if (e.data.type === 'updateParams') {
        this.smoothness = e.data.smoothness || 500
        this.threshold = e.data.threshold || 0.6
        this.sparkGain = e.data.sparkGain || 50.0

        // Clear buffer when smoothness changes
        this.envelopeBuffer = []
      }
    }
  }

  // Box-Muller transform for Gaussian noise (like np.random.normal)
  generateGaussianNoise() {
    let u1 = Math.random()
    let u2 = Math.random()
    // Avoid log(0)
    if (u1 === 0) u1 = 0.0001
    // Box-Muller transform
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0]
    const channel = output[0]

    // Calculate window size for moving average (like Python's smoothness parameter)
    const windowSize = Math.max(1, Math.floor(this.smoothness / 10))

    for (let i = 0; i < channel.length; i++) {
      // A. Generate raw uniform noise [0, 1] (like np.random.uniform)
      const rawNoise = Math.random()

      // B. Smooth using moving average (like np.convolve)
      this.envelopeBuffer.push(rawNoise)
      if (this.envelopeBuffer.length > windowSize) {
        this.envelopeBuffer.shift()
      }

      // Calculate moving average
      const sum = this.envelopeBuffer.reduce((a, b) => a + b, 0)
      this.envelope = sum / this.envelopeBuffer.length

      // C. HARD binary threshold (like: connection_mask = envelope > threshold)
      // This is the KEY to the stochastic on/off behavior
      const connectionMask = this.envelope > this.threshold ? 1.0 : 0.0

      // D. Calculate friction (rate of change - like np.diff)
      const friction = Math.abs(this.envelope - this.lastEnvelope)

      // E. Generate sparks using GAUSSIAN noise (like np.random.normal)
      // CRITICAL: Sparks are ONLY friction-based, no constant noise
      // CRITICAL: Sparks are NOT gated - they happen during transitions even when "off"
      const gaussianNoise = this.generateGaussianNoise()
      const spark = gaussianNoise * friction * this.sparkGain

      this.lastEnvelope = this.envelope

      // F. SYNTHESIS (exactly like the original):
      // audio = (hum * connection_mask) + sparks
      //
      // The envelope provides the "contact" modulation (gated)
      // The sparks provide the "friction" transients (NOT gated)
      //
      // This means:
      // - When connected (mask=1): You hear envelope + sparks
      // - When disconnected (mask=0): You ONLY hear sparks (the "breaking contact" sound)
      const gatedEnvelope = connectionMask * this.envelope

      // Output: gated envelope + ungated sparks
      // This is the secret sauce - sparks happen independently of connection state
      channel[i] = gatedEnvelope * 0.5 + spark * 0.01

      // Send envelope data to main thread for voltage starvation effect
      this.frameCount++
      if (this.frameCount >= this.sendInterval) {
        this.port.postMessage({
          type: 'envelopeUpdate',
          envelope: this.envelope,
          connectionMask: connectionMask
        })
        this.frameCount = 0
      }
    }

    return true
  }
}

registerProcessor('noise-processor', NoiseProcessor)
