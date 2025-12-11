'use client'

import { useState, useRef, useEffect } from 'react'
import CRTMonitor from '@/components/CRTMonitor'
import AudioVisualizer from '@/components/AudioVisualizer'
import VUMeter from '@/components/VUMeter'
import { LiveSynthesizer, LiveSynthParams } from '@/lib/liveSynth'
import { PRESETS, DEFAULT_PRESET } from '@/lib/presets'

export default function Home() {
  const [params, setParams] = useState<LiveSynthParams>(DEFAULT_PRESET)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [envelope, setEnvelope] = useState(0.5) // Voltage starvation state
  const synthRef = useRef<LiveSynthesizer | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize synthesizer on mount
  useEffect(() => {
    synthRef.current = new LiveSynthesizer()

    // Set up voltage starvation callback
    synthRef.current.setEnvelopeCallback((env, mask) => {
      setEnvelope(env)
    })

    return () => {
      if (synthRef.current) {
        synthRef.current.stop()
      }
    }
  }, [])

  // Update parameters in real-time when sliders change
  useEffect(() => {
    if (synthRef.current && isPlaying) {
      synthRef.current.updateParams(params)
    }
  }, [params, isPlaying])

  const handleStartStop = async () => {
    if (!synthRef.current) return

    if (isPlaying) {
      // Stop synthesis
      synthRef.current.stop()
      setIsPlaying(false)
    } else {
      // Start synthesis - iOS Safari requires AudioContext to be created synchronously
      if (!audioContextRef.current) {
        // CRITICAL: Create AudioContext synchronously within user gesture
        audioContextRef.current = synthRef.current.initializeAudioContext()
        analyserRef.current = synthRef.current.getAnalyser()

        // Then load the worklet asynchronously
        await synthRef.current.loadWorklet()
      }

      await synthRef.current.start(params)
      setIsPlaying(true)
    }
  }

  const handlePresetChange = (index: number) => {
    setSelectedPreset(index)
    setParams(PRESETS[index].params)
  }

  const handleReset = () => {
    setParams(DEFAULT_PRESET)
    setSelectedPreset(0)
  }

  return (
    <CRTMonitor envelope={envelope} isPlaying={isPlaying}>
      <div className="text-center space-y-4 md:space-y-3">
        {/* Main Title */}
        <div className="bg-gradient-to-br from-red-900/10 to-orange-900/5 border-l-4 border-red-500 p-3 rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.2)]">
          <h2 className="text-2xl md:text-3xl mb-1 drop-shadow-[0_0_20px_rgba(255,204,0,0.8)]">
            ⚡ STOCHASTIC INTERFERENCE SPECTROGRAPH
          </h2>
          <p className="text-sm md:text-base text-red-400 animate-pulse">
            &gt; SYSTEM STATUS: {isPlaying ? 'ACTIVE' : 'STANDBY'} // REAL-TIME SYNTHESIS
          </p>
        </div>

        {/* Preset Selector & Controls */}
        <div className="bg-black/30 border border-amber-500/30 rounded-lg p-3 space-y-3">
          <div className="flex gap-2 items-center">
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetChange(parseInt(e.target.value))}
              className="flex-1 bg-black border border-amber-500/50 text-amber-500 px-3 py-2 rounded text-sm uppercase tracking-wider cursor-pointer hover:border-amber-500"
            >
              {PRESETS.map((preset, idx) => (
                <option key={idx} value={idx}>
                  {preset.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-amber-500/50 text-amber-500 text-sm uppercase tracking-wider rounded hover:bg-amber-500/10"
            >
              Reset
            </button>
          </div>
          <div className="text-xs text-gray-500 text-left">
            {PRESETS[selectedPreset].description}
          </div>
        </div>

        {/* BASIC CONTROLS */}
        <div className="bg-black/30 border border-amber-500/30 rounded-lg p-3 space-y-2">
          <div className="text-sm uppercase tracking-wider text-amber-500/80 text-left border-b border-amber-500/20 pb-2">
            Basic Controls
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2">
            <div className="bg-black/50 p-3 md:p-2 rounded border border-amber-500/20">
              <label className="flex flex-col space-y-2 md:space-y-1">
                <span className="text-xs uppercase tracking-wider text-blue-400">
                  Threshold: <span className="text-amber-500">{params.threshold.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.01"
                  value={params.threshold}
                  onChange={(e) => setParams({...params, threshold: parseFloat(e.target.value)})}
                  className="accent-blue-500"
                />
              </label>
            </div>

            <div className="bg-black/50 p-3 md:p-2 rounded border border-amber-500/20">
              <label className="flex flex-col space-y-2 md:space-y-1">
                <span className="text-xs uppercase tracking-wider text-blue-400">
                  Smoothness: <span className="text-amber-500">{params.smoothness}</span>
                </span>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="10"
                  value={params.smoothness}
                  onChange={(e) => setParams({...params, smoothness: parseFloat(e.target.value)})}
                  className="accent-blue-500"
                />
              </label>
            </div>

            <div className="bg-black/50 p-3 md:p-2 rounded border border-red-500/20">
              <label className="flex flex-col space-y-2 md:space-y-1">
                <span className="text-xs uppercase tracking-wider text-red-400">
                  Spark Gain: <span className="text-amber-500">{params.sparkGain.toFixed(0)}</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={params.sparkGain}
                  onChange={(e) => setParams({...params, sparkGain: parseFloat(e.target.value)})}
                  className="accent-red-500"
                />
              </label>
            </div>

            <div className="bg-black/50 p-3 md:p-2 rounded border border-red-500/20">
              <label className="flex flex-col space-y-2 md:space-y-1">
                <span className="text-xs uppercase tracking-wider text-red-400">
                  Noise Level: <span className="text-amber-500">{params.noiseGain.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={params.noiseGain}
                  onChange={(e) => setParams({...params, noiseGain: parseFloat(e.target.value)})}
                  className="accent-red-500"
                />
              </label>
            </div>

            <div className="bg-black/50 p-3 md:p-2 rounded border border-green-500/20">
              <label className="flex flex-col space-y-2 md:space-y-1">
                <span className="text-xs uppercase tracking-wider text-green-400">
                  Hum Volume: <span className="text-amber-500">{params.humGain.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={params.humGain}
                  onChange={(e) => setParams({...params, humGain: parseFloat(e.target.value)})}
                  className="accent-green-500"
                />
              </label>
            </div>

            <div className="bg-black/50 p-3 md:p-2 rounded border border-yellow-500/20">
              <label className="flex flex-col space-y-2 md:space-y-1">
                <span className="text-xs uppercase tracking-wider text-yellow-400">
                  Master Vol: <span className="text-amber-500">{params.masterVolume.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={params.masterVolume}
                  onChange={(e) => setParams({...params, masterVolume: parseFloat(e.target.value)})}
                  className="accent-yellow-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ADVANCED CONTROLS */}
        <div className="bg-black/30 border border-amber-500/30 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-left px-3 py-2 text-sm uppercase tracking-wider text-amber-500/80 hover:bg-amber-500/5 transition-colors flex items-center justify-between"
          >
            <span>{showAdvanced ? '▼' : '▶'} Advanced Controls</span>
          </button>

          {showAdvanced && (
            <div className="p-3 space-y-3 border-t border-amber-500/20">
              <div>
                <div className="text-xs text-gray-500 mb-2">Individual Harmonic Control</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-2">
                  <div className="bg-black/50 p-3 md:p-2 rounded border border-green-500/20">
                    <label className="flex flex-col space-y-2 md:space-y-1">
                      <span className="text-xs uppercase tracking-wider text-green-400">
                        120Hz: <span className="text-amber-500">{params.hum120Gain.toFixed(2)}</span>
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={params.hum120Gain}
                        onChange={(e) => setParams({...params, hum120Gain: parseFloat(e.target.value)})}
                        className="accent-green-500"
                      />
                    </label>
                  </div>

                  <div className="bg-black/50 p-3 md:p-2 rounded border border-green-500/20">
                    <label className="flex flex-col space-y-2 md:space-y-1">
                      <span className="text-xs uppercase tracking-wider text-green-400">
                        180Hz: <span className="text-amber-500">{params.hum180Gain.toFixed(2)}</span>
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={params.hum180Gain}
                        onChange={(e) => setParams({...params, hum180Gain: parseFloat(e.target.value)})}
                        className="accent-green-500"
                      />
                    </label>
                  </div>

                  <div className="bg-black/50 p-3 md:p-2 rounded border border-green-500/20">
                    <label className="flex flex-col space-y-2 md:space-y-1">
                      <span className="text-xs uppercase tracking-wider text-green-400">
                        300Hz: <span className="text-amber-500">{params.hum300Gain.toFixed(2)}</span>
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={params.hum300Gain}
                        onChange={(e) => setParams({...params, hum300Gain: parseFloat(e.target.value)})}
                        className="accent-green-500"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-amber-500/10 pt-3">
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                  <span>Ring Modulation</span>
                  <span className="text-purple-400">&quot;Ghost in the Radio&quot;</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2">
                  <div className="bg-black/50 p-3 md:p-2 rounded border border-purple-500/20">
                    <label className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-purple-400">
                        Carrier Scan
                      </span>
                      <input
                        type="checkbox"
                        checked={params.ringModEnabled}
                        onChange={(e) => setParams({...params, ringModEnabled: e.target.checked})}
                        className="accent-purple-500 w-5 h-5"
                      />
                    </label>
                  </div>

                  <div className="bg-black/50 p-3 md:p-2 rounded border border-purple-500/20">
                    <label className="flex flex-col space-y-2 md:space-y-1">
                      <span className="text-xs uppercase tracking-wider text-purple-400">
                        Carrier: <span className="text-amber-500">{params.carrierFreq.toFixed(0)}Hz</span>
                      </span>
                      <input
                        type="range"
                        min="100"
                        max="3000"
                        step="50"
                        value={params.carrierFreq}
                        onChange={(e) => setParams({...params, carrierFreq: parseFloat(e.target.value)})}
                        className="accent-purple-500"
                        disabled={!params.ringModEnabled}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-amber-500/10 pt-3">
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                  <span>Tape Effects</span>
                  <span className="text-cyan-400">&quot;Vintage Degradation&quot;</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2">
                  <div className="bg-black/50 p-3 md:p-2 rounded border border-cyan-500/20">
                    <label className="flex flex-col space-y-2 md:space-y-1">
                      <span className="text-xs uppercase tracking-wider text-cyan-400">
                        Wow/Flutter: <span className="text-amber-500">{params.wowFlutterDepth.toFixed(2)}</span>
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={params.wowFlutterDepth}
                        onChange={(e) => setParams({...params, wowFlutterDepth: parseFloat(e.target.value)})}
                        className="accent-cyan-500"
                      />
                    </label>
                  </div>

                  <div className="bg-black/50 p-3 md:p-2 rounded border border-cyan-500/20">
                    <label className="flex flex-col space-y-2 md:space-y-1">
                      <span className="text-xs uppercase tracking-wider text-cyan-400">
                        Saturation: <span className="text-amber-500">{params.saturation.toFixed(2)}</span>
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={params.saturation}
                        onChange={(e) => setParams({...params, saturation: parseFloat(e.target.value)})}
                        className="accent-cyan-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Start/Stop Button */}
        <button
          onClick={handleStartStop}
          className={`px-6 py-3 border-2 transition-all text-lg rounded-lg uppercase tracking-wider ${
            isPlaying
              ? 'border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-black shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.8)]'
              : 'border-amber-500 bg-transparent text-amber-500 hover:bg-amber-500 hover:text-black shadow-[0_0_15px_rgba(255,204,0,0.3)] hover:shadow-[0_0_30px_rgba(255,204,0,0.8)]'
          }`}
        >
          {isPlaying ? '⏹ STOP SIGNAL' : '▶ START SIGNAL'}
        </button>

        {/* VU Meters & Visualizers */}
        {isPlaying && (
          <div className="mt-4 space-y-3">
            {/* VU Meters */}
            <div className="grid grid-cols-1 gap-2 bg-black/30 border border-amber-500/30 rounded-lg p-3">
              <VUMeter
                analyserNode={analyserRef.current}
                isPlaying={isPlaying}
                label="Master Output"
                color="#ffcc00"
              />
            </div>

            {/* Audio Visualizers */}
            <AudioVisualizer
              audioContext={audioContextRef.current}
              analyserNode={analyserRef.current}
              isPlaying={isPlaying}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="text-gray-600 text-xs border-t border-gray-800 pt-3 mt-4">
          FEDERAL BUREAU OF CONTROL PROPRIETARY TECH // REAL-TIME SYNTHESIS ENGINE<br/>
          <span className="text-gray-500">&quot;The owls are not what they seem.&quot;</span>
        </footer>
      </div>
    </CRTMonitor>
  )
}
