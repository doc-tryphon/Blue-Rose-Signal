'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

export default function BootMenu() {
  const router = useRouter()
  const [lines, setLines] = useState<string[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus hidden input for keyboard capture
    inputRef.current?.focus()

    const sequence = [
      { text: "> CONNECTED: BLUE ROSE DIVISION MAINFRAME", delay: 800 },
      { text: "> AUTHENTICATING...", delay: 1500 },
      { text: "> ACCESS GRANTED.", delay: 800 },
      { text: "> SELECT MODULE:", delay: 500 },
    ]

    let totalDelay = 0
    sequence.forEach(({ text, delay }, index) => {
      totalDelay += delay
      setTimeout(() => {
        setLines(prev => [...prev, text])
        if (index === sequence.length - 1) {
          setShowMenu(true)
        }
      }, totalDelay)
    })
  }, [])

  // Handle keyboard input (1, 2, or 3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showMenu) return

      if (e.key === '1') {
        setInput('1')
        setTimeout(() => router.push('/mainframe'), 300)
      } else if (e.key === '2') {
        setInput('2')
        setTimeout(() => router.push('/spectrograph'), 300)
      } else if (e.key === '3') {
        setInput('3')
        setTimeout(() => router.push('/aeon'), 300)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showMenu, router])

  return (
    <div
      className="min-h-screen bg-black text-crt-amber font-vt323 p-8 md:p-16 flex flex-col relative overflow-hidden"
      onClick={() => inputRef.current?.focus()} // Keep focus for keyboard
    >
      {/* Scanlines & Vignette */}
      <div className="absolute inset-0 pointer-events-none opacity-20 scanlines z-10"></div>
      <div className="absolute inset-0 pointer-events-none z-20"
        style={{ background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%)' }}
      />

      <div className="max-w-3xl w-full mx-auto relative z-30 space-y-4 text-lg md:text-2xl leading-relaxed">

        {/* Terminal Output */}
        {lines.map((line, i) => (
          <div key={i} className="typewriter-line">{line}</div>
        ))}

        {/* Menu Options */}
        {showMenu && (
          <div className="mt-8 space-y-4 animate-in fade-in duration-300">

            <Link
              href="/mainframe"
              className="group flex items-center gap-1 hover:bg-crt-amber/10 hover:text-white transition-all p-2 -mx-2"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-crt-amber">[</span>
              [1] MAINFRAME DASHBOARD (AUTHORIZED PERSONNEL ONLY)
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-crt-amber">]</span>
            </Link>

            <Link
              href="/spectrograph"
              className="group flex items-center gap-1 hover:bg-crt-amber/10 hover:text-white transition-all p-2 -mx-2"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-crt-amber">[</span>
              [2] SIGNAL SPECTROGRAPH (PUBLIC UTILITY)
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-crt-amber">]</span>
            </Link>

            <Link
              href="/aeon"
              className="group flex items-center gap-1 hover:bg-crt-amber/10 hover:text-white transition-all p-2 -mx-2"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-crt-amber">[</span>
              [3] PROJECT AEON (NEURAL INTERFACE)
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-crt-amber">]</span>
            </Link>
            <div className="mt-8 flex items-center gap-2">
              <span>&gt; INPUT SELECTION:</span>
              <span className="inline-block min-w-[20px]">{input}</span>
              <span className="animate-pulse block w-3 h-5 bg-crt-amber" />
            </div>

          </div>
        )}
      </div>

      {/* Hidden input for mobile keyboard support */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute top-0 left-0 h-full w-full cursor-default"
        autoFocus
      />

      <style jsx>{`
        .typewriter-line {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 0.5s steps(40, end);
        }
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
      `}</style>
    </div>
  )
}
