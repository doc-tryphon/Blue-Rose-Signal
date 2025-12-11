'use client'

import { useEffect, useRef } from 'react'

interface AudioVisualizerProps {
  audioContext: AudioContext | null
  analyserNode: AnalyserNode | null
  isPlaying: boolean
}

export default function AudioVisualizer({ audioContext, analyserNode, isPlaying }: AudioVisualizerProps) {
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null)
  const spectrogramCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!analyserNode || !isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const waveformCanvas = waveformCanvasRef.current
    const spectrogramCanvas = spectrogramCanvasRef.current

    if (!waveformCanvas || !spectrogramCanvas) return

    const waveformCtx = waveformCanvas.getContext('2d')
    const spectrogramCtx = spectrogramCanvas.getContext('2d')

    if (!waveformCtx || !spectrogramCtx) return

    // Set up analyser
    analyserNode.fftSize = 2048
    const bufferLength = analyserNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const frequencyArray = new Uint8Array(bufferLength)

    // Spectrogram scrolling buffer
    let spectrogramImageData: ImageData | null = null

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)

      // Get waveform data
      analyserNode.getByteTimeDomainData(dataArray)

      // Draw waveform (oscilloscope style)
      waveformCtx.fillStyle = '#000000'
      waveformCtx.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height)

      waveformCtx.lineWidth = 2
      waveformCtx.strokeStyle = '#ffcc00'
      waveformCtx.shadowBlur = 8
      waveformCtx.shadowColor = '#ffcc00'

      waveformCtx.beginPath()

      const sliceWidth = waveformCanvas.width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * waveformCanvas.height) / 2

        if (i === 0) {
          waveformCtx.moveTo(x, y)
        } else {
          waveformCtx.lineTo(x, y)
        }

        x += sliceWidth
      }

      waveformCtx.lineTo(waveformCanvas.width, waveformCanvas.height / 2)
      waveformCtx.stroke()

      // Draw spectrogram (frequency over time)
      analyserNode.getByteFrequencyData(frequencyArray)

      // Scroll existing spectrogram to the left
      if (!spectrogramImageData) {
        spectrogramImageData = spectrogramCtx.createImageData(spectrogramCanvas.width, spectrogramCanvas.height)
      }

      // Shift image data left by 1 pixel
      const imageData = spectrogramCtx.getImageData(1, 0, spectrogramCanvas.width - 1, spectrogramCanvas.height)
      spectrogramCtx.putImageData(imageData, 0, 0)

      // Draw new column on the right
      const barHeight = spectrogramCanvas.height / bufferLength

      for (let i = 0; i < bufferLength; i++) {
        const value = frequencyArray[i]

        // Color based on intensity (black -> red -> yellow -> white)
        let r, g, b
        if (value < 64) {
          r = value * 4
          g = 0
          b = 0
        } else if (value < 128) {
          r = 255
          g = (value - 64) * 4
          b = 0
        } else if (value < 192) {
          r = 255
          g = 255
          b = (value - 128) * 4
        } else {
          r = 255
          g = 255
          b = 255
        }

        spectrogramCtx.fillStyle = `rgb(${r}, ${g}, ${b})`
        spectrogramCtx.fillRect(
          spectrogramCanvas.width - 1,
          spectrogramCanvas.height - (i * barHeight) - barHeight,
          1,
          barHeight
        )
      }
    }

    draw()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [analyserNode, isPlaying])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {/* Waveform Display */}
      <div className="border border-amber-500/30 rounded p-2 bg-black/50">
        <div className="text-xs text-amber-500/70 mb-1 uppercase tracking-wider">Waveform</div>
        <canvas
          ref={waveformCanvasRef}
          width={600}
          height={100}
          className="w-full h-auto bg-black rounded"
          style={{ imageRendering: 'crisp-edges' }}
        />
      </div>

      {/* Spectrogram Display */}
      <div className="border border-amber-500/30 rounded p-2 bg-black/50">
        <div className="text-xs text-amber-500/70 mb-1 uppercase tracking-wider">Spectrogram</div>
        <canvas
          ref={spectrogramCanvasRef}
          width={600}
          height={100}
          className="w-full h-auto bg-black rounded"
          style={{ imageRendering: 'crisp-edges' }}
        />
      </div>
    </div>
  )
}
