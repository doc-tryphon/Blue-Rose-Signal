import { LiveSynthParams } from './liveSynth'

export interface Preset {
  name: string
  description: string
  params: LiveSynthParams
}

export const PRESETS: Preset[] = [
  {
    name: "Classic Hum",
    description: "Balanced 60Hz drone with subtle crackling",
    params: {
      threshold: 0.6,
      smoothness: 500,
      sparkGain: 30,
      noiseGain: 0.4,
      humGain: 0.5,
      hum120Gain: 0.2,
      hum180Gain: 0.15,
      hum300Gain: 0.1,
      ringModEnabled: false,
      carrierFreq: 800,
      wowFlutterDepth: 0.0,
      saturation: 0.0,
      masterVolume: 0.3
    }
  },
  {
    name: "Heavy Crackle",
    description: "Aggressive sparks with prominent electrical noise",
    params: {
      threshold: 0.3,
      smoothness: 100,
      sparkGain: 150,
      noiseGain: 0.7,
      humGain: 0.3,
      hum120Gain: 0.15,
      hum180Gain: 0.1,
      hum300Gain: 0.05,
      ringModEnabled: false,
      carrierFreq: 800,
      wowFlutterDepth: 0.0,
      saturation: 0.0,
      masterVolume: 0.4
    }
  },
  {
    name: "Ethereal Drone",
    description: "Smooth, haunting tone with minimal interference",
    params: {
      threshold: 0.8,
      smoothness: 1500,
      sparkGain: 20,
      noiseGain: 0.2,
      humGain: 0.7,
      hum120Gain: 0.3,
      hum180Gain: 0.25,
      hum300Gain: 0.15,
      ringModEnabled: false,
      carrierFreq: 800,
      wowFlutterDepth: 0.0,
      saturation: 0.0,
      masterVolume: 0.35
    }
  },
  {
    name: "Unstable Signal",
    description: "Chaotic modulation with heavy sparking",
    params: {
      threshold: 0.4,
      smoothness: 200,
      sparkGain: 120,
      noiseGain: 0.6,
      humGain: 0.4,
      hum120Gain: 0.25,
      hum180Gain: 0.2,
      hum300Gain: 0.15,
      ringModEnabled: false,
      carrierFreq: 800,
      wowFlutterDepth: 0.0,
      saturation: 0.0,
      masterVolume: 0.38
    }
  },
  {
    name: "Deep Rumble",
    description: "Low frequency emphasis with organic fluctuation",
    params: {
      threshold: 0.55,
      smoothness: 800,
      sparkGain: 40,
      noiseGain: 0.3,
      humGain: 0.8,
      hum120Gain: 0.4,
      hum180Gain: 0.2,
      hum300Gain: 0.1,
      ringModEnabled: false,
      carrierFreq: 800,
      wowFlutterDepth: 0.0,
      saturation: 0.0,
      masterVolume: 0.32
    }
  }
]

export const DEFAULT_PRESET: LiveSynthParams = PRESETS[0].params
