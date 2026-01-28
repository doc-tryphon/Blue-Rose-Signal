'use client'

interface FidelityMeterProps {
    fidelity?: number
}

export default function FidelityMeter({ fidelity = 100 }: FidelityMeterProps) {
    // Generate random fluctuations for visual effect
    const fluctuation = Math.random() * 2

    return (
        <div className="border border-crt-amber/30 p-2 bg-black/40">
            <div className="text-xs text-crt-amber/60 mb-1">SIGNAL FIDELITY</div>

            {/* Bars */}
            <div className="flex gap-0.5 h-12 items-end mb-2">
                {Array.from({ length: 20 }).map((_, i) => {
                    const height = Math.min(100, Math.max(10, fidelity + (Math.random() * 20 - 10)))
                    return (
                        <div
                            key={i}
                            className={`flex-1 transition-all duration-300 ${i > 15 && fidelity < 90 ? 'bg-red-500/50' : 'bg-crt-amber/50'
                                }`}
                            style={{
                                height: `${height}%`,
                                opacity: Math.random() > 0.8 ? 0.5 : 0.8
                            }}
                        />
                    )
                })}
            </div>

            <div className="flex justify-between items-center text-sm font-bold">
                <span>INTEGRITY:</span>
                <span className={fidelity < 85 ? 'text-red-500 animate-pulse' : 'text-crt-amber'}>
                    {fidelity.toFixed(1)}%
                </span>
            </div>
        </div>
    )
}
