'use client'

interface CRTMonitorProps {
  children: React.ReactNode
  envelope?: number
  isPlaying?: boolean
}

export default function CRTMonitor({ children, envelope = 0.5, isPlaying = false }: CRTMonitorProps) {
  // Voltage starvation effect: modulate brightness/opacity based on envelope
  // Map envelope (0-1) to opacity/brightness range (0.7-1.0) for subtle flicker
  const voltageStarvation = isPlaying ? 0.7 + (envelope * 0.3) : 1.0

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-0 lg:p-8">
      {/* Vintage TV Cabinet - Brown/Wood style (Desktop) / Thin Handheld Bezel (Mobile) */}
      <div className="relative w-full lg:max-w-6xl">
        {/* Main TV housing - Mobile: thin dark bezel, Desktop: wood-grain cabinet */}
        <div
          className="relative rounded-none lg:rounded-2xl shadow-2xl p-2 lg:p-10 lg:pb-20"
          style={{
            background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)',
          }}
        >
          {/* Desktop-only wood-grain cabinet overlay */}
          <div
            className="hidden lg:block absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(145deg, #5a3825 0%, #4a2f1e 30%, #3a2518 70%, #2a1810 100%)',
              boxShadow: `
                inset 0 3px 0 rgba(139,90,60,0.4),
                inset 0 -3px 0 rgba(0,0,0,0.8),
                0 50px 120px rgba(0,0,0,1),
                0 25px 80px rgba(0,0,0,0.95)
              `
            }}
          />
          {/* Wood grain texture overlay - Desktop only */}
          <div
            className="hidden lg:block absolute inset-0 rounded-2xl pointer-events-none opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.1) 2px,
                rgba(0,0,0,0.1) 4px
              )`,
            }}
          />

          {/* Top bezel highlight - Desktop only */}
          <div
            className="hidden lg:block absolute top-0 left-0 right-0 h-16 rounded-t-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(139,90,60,0.3) 0%, transparent 100%)',
            }}
          />

          {/* Control Panel - Right Side (Desktop only) */}
          <div
            className="hidden lg:flex absolute top-20 right-8 flex-col gap-6 items-center"
            style={{
              background: 'linear-gradient(145deg, #3a2518 0%, #2a1810 100%)',
              padding: '20px 12px',
              borderRadius: '12px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
            }}
          >
            {/* Volume knob */}
            <div>
              <div
                className="w-12 h-12 rounded-full relative"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #d4a574, #8b5a3c)',
                  boxShadow: `
                    0 4px 8px rgba(0,0,0,0.8),
                    inset 0 1px 0 rgba(255,255,255,0.3),
                    inset 0 -2px 4px rgba(0,0,0,0.5)
                  `
                }}
              >
                <div className="absolute top-1 left-1/2 w-1 h-4 bg-black rounded transform -translate-x-1/2" />
              </div>
              <div className="text-xs text-center mt-1 text-amber-200/60">VOL</div>
            </div>

            {/* Channel knob */}
            <div>
              <div
                className="w-12 h-12 rounded-full relative"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #d4a574, #8b5a3c)',
                  boxShadow: `
                    0 4px 8px rgba(0,0,0,0.8),
                    inset 0 1px 0 rgba(255,255,255,0.3),
                    inset 0 -2px 4px rgba(0,0,0,0.5)
                  `
                }}
              >
                <div className="absolute top-1 left-1/2 w-1 h-4 bg-black rounded transform -translate-x-1/2" />
              </div>
              <div className="text-xs text-center mt-1 text-amber-200/60">CH</div>
            </div>

            {/* Brightness knob */}
            <div>
              <div
                className="w-10 h-10 rounded-full relative"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #c4956a, #7b4a2c)',
                  boxShadow: `
                    0 3px 6px rgba(0,0,0,0.8),
                    inset 0 1px 0 rgba(255,255,255,0.2),
                    inset 0 -2px 3px rgba(0,0,0,0.5)
                  `
                }}
              >
                <div className="absolute top-1 left-1/2 w-0.5 h-3 bg-black rounded transform -translate-x-1/2" />
              </div>
              <div className="text-xs text-center mt-1 text-amber-200/50">BR</div>
            </div>
          </div>

          {/* Screen container */}
          <div className="relative bg-black rounded-xl overflow-hidden">
            {/* Inner bezel shadow - deep set screen */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                boxShadow: `
                  inset 0 0 50px rgba(0,0,0,0.95),
                  inset 0 10px 30px rgba(0,0,0,0.9),
                  inset -5px 0 15px rgba(0,0,0,0.7),
                  inset 5px 0 15px rgba(0,0,0,0.7)
                `,
              }}
            />

            {/* Scanlines overlay */}
            <div className="absolute inset-0 scanlines z-10" />

            {/* Vignette effect - CRT curved glass */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 20%, transparent 45%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.7) 100%)',
              }}
            />

            {/* Glass reflection */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.05) 50%, transparent 70%)',
              }}
            />

            {/* Content area with voltage starvation effect */}
            <div
              className="relative z-0 p-4 md:p-6 min-h-[500px] transition-opacity duration-75"
              style={{
                opacity: voltageStarvation,
                filter: `brightness(${voltageStarvation})`
              }}
            >
              {children}
            </div>
          </div>

          {/* Speaker grille at bottom - Desktop only */}
          <div
            className="hidden lg:block absolute bottom-4 left-20 right-20 h-16 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, #2a1810 0%, #1a0f08 100%)',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.9)',
            }}
          >
            {/* Speaker holes pattern */}
            <div className="w-full h-full flex items-center justify-center gap-1">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-8 rounded-full"
                  style={{
                    background: 'rgba(0,0,0,0.8)',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.9)',
                  }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* TV legs/stand - Desktop only */}
        <div className="hidden lg:flex justify-between px-16 mt-2">
          <div
            className="w-20 h-8 rounded-b-lg"
            style={{
              background: 'linear-gradient(180deg, #3a2518 0%, #2a1810 100%)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.8)',
            }}
          />
          <div
            className="w-20 h-8 rounded-b-lg"
            style={{
              background: 'linear-gradient(180deg, #3a2518 0%, #2a1810 100%)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.8)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
