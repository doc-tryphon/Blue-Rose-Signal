# ⚡ Signal Spectrograph: Technical Manual

**Module**: [Blue Rose Signal](/spectrograph)
**Status**: ACTIVE
**Tech**: Web Audio API / AudioWorklet

## Overview
The **Signal Spectrograph** is a real-time stochastic interference synthesizer. It does not play pre-recorded loops; it generates audio live using advanced DSP techniques to strictly adhere to the mathematical models of "The Hum".

## Key Features

- **Real-Time Synthesis**: Live audio generation using Web Audio API and AudioWorkletProcessor
- **Stochastic DSP Engine**: Faithful recreation of the original Python algorithm
  - Gaussian noise generation via Box-Muller transform
  - Moving average envelope smoothing (convolution-based)
  - Binary threshold gating for stochastic on/off behavior
  - Friction-based spark generation (ungated for authentic breaking contact sounds)
- **60Hz Mains Hum + Harmonics**: Individual control over 60Hz, 120Hz, 180Hz, and 300Hz components
- **High-Voltage Arc Chain**: Parallel spectral processing (3kHz HPF + hard clipper) for electrical "snap" emphasis
- **Ring Modulation**: Carrier oscillator creates inharmonic sidebands ("Ghost in the Radio" effect)
- **Tape Wow/Flutter**: LFO-modulated delay simulates vintage tape pitch wobble (0-2ms, 1.5Hz)
- **Tape Saturation**: Sigmoid waveshaping with 4x oversampling for warm analog-style soft clipping

## Parameters Explained

### Noise/Spark Controls
- **Threshold** (0.1-0.9): Connection probability - lower = more "off" time, more stochastic behavior
- **Smoothness** (50-2000): Envelope smoothing window size - higher = slower, smoother transitions
- **Spark Gain** (0-200): Intensity of friction-based transients
- **Noise Level** (0-1): Overall volume of the noise processor output

### Hum Controls
- **Hum Volume** (0-1): 60Hz fundamental gain
- **120Hz Gain** (0-1): First harmonic (2nd order)
- **180Hz Gain** (0-1): Second harmonic (3rd order)
- **300Hz Gain** (0-1): Third harmonic (5th order)

### Ring Modulation ("Ghost in the Radio")
- **Carrier Scan** (on/off): Enables/disables ring modulation effect
- **Carrier Frequency** (100-3000Hz): Frequency of carrier oscillator for spectral multiplication

### Tape Effects
- **Wow/Flutter** (0-1): Depth of pitch wobble simulating tape speed variations (0-2ms delay modulation)
- **Saturation** (0-1): Amount of soft clipping/harmonic distortion (0-50x drive)

## DSP Algorithm

The core audio synthesis follows this processing pipeline:

```mermaid
flowchart TD
    Start([Audio Sample Loop]) --> RawNoise[Generate Uniform Noise 0,1]
    RawNoise --> MovAvg[Moving Average Smoothing<br/>windowSize = smoothness/10]
    MovAvg --> Normalize[Normalize Envelope<br/>envelope ∈ 0,1]
    Normalize --> Threshold{envelope > threshold?}

    Threshold -->|Yes| Connected[connectionMask = 1.0]
    Threshold -->|No| Disconnected[connectionMask = 0.0]

    Connected --> Gate[Gate Envelope<br/>gatedEnv = mask × envelope]
    Disconnected --> Gate

    Normalize --> Friction[Calculate Friction<br/>friction = |env<sub>t</sub> - env<sub>t-1</sub>|]
    Friction --> Gaussian[Box-Muller Transform<br/>gaussianNoise ~ N0,1]
    Gaussian --> Spark[Spark Generation<br/>spark = gaussian × friction × sparkGain]

    Gate --> Mix[Mix Signals<br/>output = gatedEnv × 0.5 + spark × 0.01]
    Spark --> Mix

    Mix --> Output([Audio Output])

    style Threshold fill:#ff9,stroke:#333,stroke-width:2px
    style Spark fill:#9cf,stroke:#333,stroke-width:2px
    style Mix fill:#f96,stroke:#333,stroke-width:3px
```

**Critical Design Feature**: Sparks are NOT gated by the threshold. This means when the signal is "disconnected" (mask=0), you still hear sparks from envelope transitions, creating the characteristic "breaking contact" sound.

## Technical Deep Dive

### Box-Muller Transform
To match NumPy's `np.random.normal(0, 1)`, we implement the Box-Muller transform:

```javascript
generateGaussianNoise() {
  let u1 = Math.random()
  let u2 = Math.random()
  if (u1 === 0) u1 = 0.0001  // Avoid log(0)
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
}
```
This produces normally-distributed random numbers with mean=0 and variance=1.

### Tape Saturation Bypass
The tape saturation effect uses a sigmoid (hyperbolic tangent) curve for warm analog-style soft clipping. However, when saturation is set to 0, a mathematical edge case occurs where `tanh(0) = 0`, muting the audio.

**The Solution**: When `amount < 0.01`, the `makeSaturationCurve()` function returns a **linear/identity curve** where `curve[i] = x`.

---
*For quantum mechanical parallels, see [QUANTUM_MATHEMATICS.md](QUANTUM_MATHEMATICS.md).*
