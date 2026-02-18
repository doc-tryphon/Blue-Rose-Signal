'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
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
  const [envelope, setEnvelope] = useState(0.5)
  const synthRef = useRef<LiveSynthesizer | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    synthRef.current = new LiveSynthesizer()

    synthRef.current.setEnvelopeCallback((env, mask) => {
      setEnvelope(env)
    })

    return () => {
      if (synthRef.current) {
        synthRef.current.stop()
      }
    }
  }, [])

  useEffect(() => {
    if (synthRef.current && isPlaying) {
      synthRef.current.updateParams(params)
    }
  }, [params, isPlaying])

  const handleStartStop = async () => {
    if (!synthRef.current) return

    if (isPlaying) {
      synthRef.current.stop()
      setIsPlaying(false)
    } else {
      if (!audioContextRef.current) {
        audioContextRef.current = synthRef.current.initializeAudioContext()
        analyserRef.current = synthRef.current.getAnalyser()
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
      <div className="font-vt323 text-crt-amber space-y-4 max-w-4xl mx-auto">

        {/* Header */}
        <div className="border-b-2 border-crt-amber/50 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold leading-none tracking-wider">
            STOCHASTIC INTERFERENCE SPECTROGRAPH
          </h1>
          <div className="text-xs opacity-70 mt-1">
            SIGNAL SYNTHESIS // REAL-TIME // {isPlaying ? 'ACTIVE' : 'STANDBY'}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-crt-amber/30 pb-3">
          <Link href="/mainframe" className="px-3 py-1 uppercase tracking-wider text-sm border border-crt-amber/50 hover:bg-crt-amber hover:text-black transition-colors">
            ◄ MAINFRAME
          </Link>
          <Link href="/aeon" className="px-3 py-1 uppercase tracking-wider text-sm border border-crt-amber/50 hover:bg-crt-amber hover:text-black transition-colors">
            PROJECT AEON
          </Link>
          <Link href="/" className="px-3 py-1 uppercase tracking-wider text-sm border border-crt-amber/30 text-crt-amber/50 hover:bg-crt-amber/20 hover:text-crt-amber transition-colors ml-auto">
            ◄ BOOT MENU
          </Link>
        </div>

        {/* Preset Selector */}
        <div className="border border-crt-amber/30 p-3 bg-black/20 space-y-3">
          <div className="text-xs uppercase tracking-wider text-crt-amber/60 border-b border-crt-amber/20 pb-2">
            Signal Preset
          </div>
          <div className="flex gap-2 items-center">
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetChange(parseInt(e.target.value))}
              className="flex-1 bg-black border border-crt-amber/50 text-crt-amber px-3 py-2 text-sm uppercase tracking-wider cursor-pointer hover:border-crt-amber"
            >
              {PRESETS.map((preset, idx) => (
                <option key={idx} value={idx}>
                  {preset.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-crt-amber/50 text-crt-amber text-sm uppercase tracking-wider hover:bg-crt-amber/10 transition-colors"
            >
              RESET
            </button>
          </div>
          <div className="text-xs text-crt-amber/40">
            {PRESETS[selectedPreset].description}
          </div>
        </div>

        {/* Basic Controls */}
        <div className="border border-crt-amber/30 p-3 bg-black/20 space-y-2">
          <div className="text-xs uppercase tracking-wider text-crt-amber/60 border-b border-crt-amber/20 pb-2">
            Basic Controls
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2">

            <div className="bg-black/40 p-3 md:p-2 border border-crt-amber/20">
              <label className="flex flex-col space-y-2 md:space-y-1">
                <span className="text-xs uppercase tracking-wider text-crt-amber/70">
                  Threshold: <span className="text-crt-amber">{params.threshold.toFixed(2)}</span>
                </span>
                <input type="range" min="0.1" max="0.9" step="0.01" value={params.threshold}
                  onChange={(e) => setParams({...params, threshold: parseFloat(e.target.value)})} />
              </label>
            </div>

            <div className="bg-black/40 p-3 md:p-2 border border-crt-amber/20">
              <label className="flex flex-col space-y-2 md:space-y-1">
                <span className="text-xs uppercase tracking-wider text-crt-amber/70">
                  Smoothness: <span className="text-crt-amber">{params.smoothness}</span>
                </span>
                <input type="range" min="50" max="2000" step="10" value={params.smoothness}
                  onChange={(e) => setParams({...params, smoothness: parseFloat(e.target.value)})} />
              </label>
            </div>

            <div className="bg-black/40 p-3 md:p-2 border border-red-500/20">
              <label className="flex flex-col space-y-2 md:space-y-1">
                <span className="text-xs uppercase tracking-wider text-red-400">
                  Spark Gain: <span className="text-crt-amber">{params.sparkGain.toFixed(0)}</span>
                </span>
                <input type="range" min="0" max="200" step="5" value={params.sparkGain}
                  onChange={(e) => setParams({...params, sparkGain: parseFloat(e.target.value)})}
                  className="accent-red-500" />
              </label>
            </div>

            <div className="bg-black/40 p-3 md:p-2 border border-red-500/20">
              <label className="flex flex-col space-y-2 md:space-y-1">
                <span className="text-xs uppercase tracking-wider text-red-400">
                  Noise Level: <span className="text-crt-amber">{params.noiseGain.toFixed(2)}</span>
                </span>
                <input type="range" min="0" max="1" step="0.01" value={params.noiseGain}
                  onChange={(e) => setParams({...params, noiseGain: parseFloat(e.target.value)})}
                  className="accent-red-500" />
              </label>
            </div>

            <div className="bg-black/40 p-3 md:p-2 border border-crt-amber/20">
              <label className="flex flex-col space-y-2 md:space-y-1">
                <span className="text-xs uppercase tracking-wider text-crt-amber/70">
                  Hum Volume: <span className="text-crt-amber">{params.humGain.toFixed(2)}</span>
                </span>
                <input type="range" min="0" max="1" step="0.01" value={params.humGain}
                  onChange={(e) => setParams({...params, humGain: parseFloat(e.target.value)})} />
              </label>
            </div>

            <div className="bg-black/40 p-3 md:p-2 border border-crt-amber/20">
              <label className="flex flex-col space-y-2 md:space-y-1">
                <span className="text-xs uppercase tracking-wider text-crt-amber/70">
                  Master Vol: <span className="text-crt-amber">{params.masterVolume.toFixed(2)}</span>
                </span>
                <input type="range" min="0" max="1" step="0.01" value={params.masterVolume}
                  onChange={(e) => setParams({...params, masterVolume: parseFloat(e.target.value)})} />
              </label>
            </div>

          </div>
        </div>

        {/* Advanced Controls */}
        <div className="border border-crt-amber/30 bg-black/20 overflow-hidden">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-left px-3 py-2 text-xs uppercase tracking-wider text-crt-amber/70 hover:bg-crt-amber/5 transition-colors flex items-center justify-between"
          >
            <span>{showAdvanced ? '▼' : '▶'} Advanced Controls</span>
          </button>

          {showAdvanced && (
            <div className="p-3 space-y-3 border-t border-crt-amber/20">

              <div>
                <div className="text-xs text-crt-amber/40 mb-2 uppercase tracking-wider">Individual Harmonic Control</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-2">
                  <div className="bg-black/40 p-3 md:p-2 border border-crt-amber/20">
                    <label className="flex flex-col space-y-2 md:space-y-1">
                      <span className="text-xs uppercase tracking-wider text-crt-amber/70">
                        120Hz: <span className="text-crt-amber">{params.hum120Gain.toFixed(2)}</span>
                      </span>
                      <input type="range" min="0" max="1" step="0.01" value={params.hum120Gain}
                        onChange={(e) => setParams({...params, hum120Gain: parseFloat(e.target.value)})} />
                    </label>
                  </div>
                  <div className="bg-black/40 p-3 md:p-2 border border-crt-amber/20">
                    <label className="flex flex-col space-y-2 md:space-y-1">
                      <span className="text-xs uppercase tracking-wider text-crt-amber/70">
                        180Hz: <span className="text-crt-amber">{params.hum180Gain.toFixed(2)}</span>
                      </span>
                      <input type="range" min="0" max="1" step="0.01" value={params.hum180Gain}
                        onChange={(e) => setParams({...params, hum180Gain: parseFloat(e.target.value)})} />
                    </label>
                  </div>
                  <div className="bg-black/40 p-3 md:p-2 border border-crt-amber/20">
                    <label className="flex flex-col space-y-2 md:space-y-1">
                      <span className="text-xs uppercase tracking-wider text-crt-amber/70">
                        300Hz: <span className="text-crt-amber">{params.hum300Gain.toFixed(2)}</span>
                      </span>
                      <input type="range" min="0" max="1" step="0.01" value={params.hum300Gain}
                        onChange={(e) => setParams({...params, hum300Gain: parseFloat(e.target.value)})} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-crt-amber/10 pt-3">
                <div className="text-xs text-crt-amber/40 mb-2 uppercase tracking-wider flex items-center gap-2">
                  Ring Modulation <span className="text-crt-amber/60 normal-case italic">&quot;Ghost in the Radio&quot;</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2">
                  <div className="bg-black/40 p-3 md:p-2 border border-crt-amber/20">
                    <label className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-crt-amber/70">Carrier Scan</span>
                      <input type="checkbox" checked={params.ringModEnabled}
                        onChange={(e) => setParams({...params, ringModEnabled: e.target.checked})}
                        className="w-5 h-5" />
                    </label>
                  </div>
                  <div className="bg-black/40 p-3 md:p-2 border border-crt-amber/20">
                    <label className="flex flex-col space-y-2 md:space-y-1">
                      <span className="text-xs uppercase tracking-wider text-crt-amber/70">
                        Carrier: <span className="text-crt-amber">{params.carrierFreq.toFixed(0)}Hz</span>
                      </span>
                      <input type="range" min="100" max="3000" step="50" value={params.carrierFreq}
                        onChange={(e) => setParams({...params, carrierFreq: parseFloat(e.target.value)})}
                        disabled={!params.ringModEnabled} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-crt-amber/10 pt-3">
                <div className="text-xs text-crt-amber/40 mb-2 uppercase tracking-wider flex items-center gap-2">
                  Tape Effects <span className="text-crt-amber/60 normal-case italic">&quot;Vintage Degradation&quot;</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2">
                  <div className="bg-black/40 p-3 md:p-2 border border-crt-amber/20">
                    <label className="flex flex-col space-y-2 md:space-y-1">
                      <span className="text-xs uppercase tracking-wider text-crt-amber/70">
                        Wow/Flutter: <span className="text-crt-amber">{params.wowFlutterDepth.toFixed(2)}</span>
                      </span>
                      <input type="range" min="0" max="1" step="0.01" value={params.wowFlutterDepth}
                        onChange={(e) => setParams({...params, wowFlutterDepth: parseFloat(e.target.value)})} />
                    </label>
                  </div>
                  <div className="bg-black/40 p-3 md:p-2 border border-crt-amber/20">
                    <label className="flex flex-col space-y-2 md:space-y-1">
                      <span className="text-xs uppercase tracking-wider text-crt-amber/70">
                        Saturation: <span className="text-crt-amber">{params.saturation.toFixed(2)}</span>
                      </span>
                      <input type="range" min="0" max="1" step="0.01" value={params.saturation}
                        onChange={(e) => setParams({...params, saturation: parseFloat(e.target.value)})} />
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
          className={`w-full px-6 py-3 border-2 transition-all text-lg uppercase tracking-wider ${
            isPlaying
              ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.8)]'
              : 'border-crt-amber text-crt-amber hover:bg-crt-amber hover:text-black shadow-[0_0_15px_rgba(255,204,0,0.3)] hover:shadow-[0_0_30px_rgba(255,204,0,0.8)]'
          }`}
        >
          {isPlaying ? '⏹ STOP SIGNAL' : '▶ START SIGNAL'}
        </button>

        {/* Signal Monitors — always visible */}
        <div className="space-y-3">
          <div className="border border-crt-amber/30 bg-black/20 p-3">
            <div className="text-xs uppercase tracking-wider text-crt-amber/60 border-b border-crt-amber/20 pb-2 mb-3">
              Signal Output
            </div>
            <VUMeter
              analyserNode={analyserRef.current}
              isPlaying={isPlaying}
              label="Master Output"
              color="#ffcc00"
            />
          </div>
          <AudioVisualizer
            audioContext={audioContextRef.current}
            analyserNode={analyserRef.current}
            isPlaying={isPlaying}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-crt-amber/30 pt-4 mt-8 text-center text-xs opacity-60">
          FEDERAL BUREAU OF CONTROL // BLUE ROSE DIVISION
          <br/>
          <span className="italic">&quot;The owls are not what they seem.&quot;</span>
        </div>

      </div>
    </CRTMonitor>
  )
}
