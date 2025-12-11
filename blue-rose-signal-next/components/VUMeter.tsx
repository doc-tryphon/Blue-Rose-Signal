'use client'

import { useEffect, useRef } from 'react'

interface VUMeterProps {
  analyserNode: AnalyserNode | null
  isPlaying: boolean
  label: string
  color?: string
}

export default function VUMeter({ analyserNode, isPlaying, label, color = '#ffcc00' }: VUMeterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!analyserNode || !isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount)

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)

      analyserNode.getByteFrequencyData(dataArray)

      // Calculate RMS level
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += (dataArray[i] / 255.0) ** 2
      }
      const rms = Math.sqrt(sum / dataArray.length)
      const level = rms * 100 // Convert to 0-100 scale

      // Draw VU meter
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw level bar
      const barWidth = (level / 100) * canvas.width

      // Create gradient for level indicator
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, color)
      gradient.addColorStop(0.7, color)
      gradient.addColorStop(1, '#ff0000')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, barWidth, canvas.height)

      // Add glow effect
      ctx.shadowBlur = 10
      ctx.shadowColor = color
      ctx.fillRect(0, 0, barWidth, canvas.height)
      ctx.shadowBlur = 0

      // Draw tick marks
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 1
      for (let i = 0; i <= 10; i++) {
        const x = (i / 10) * canvas.width
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
    }

    draw()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [analyserNode, isPlaying, color])

  return (
    <div className="space-y-1">
      <div className="text-xs text-amber-500/70 uppercase tracking-wider">{label}</div>
      <canvas
        ref={canvasRef}
        width={200}
        height={20}
        className="w-full h-auto bg-black rounded border border-amber-500/20"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  )
}
