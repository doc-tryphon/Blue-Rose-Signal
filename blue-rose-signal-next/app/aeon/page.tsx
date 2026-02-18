'use client'

import { useState } from 'react'
import CRTMonitor from '@/components/CRTMonitor'
import ChatInterface from '@/components/aeon/ChatInterface'
import ProtocolState from '@/components/aeon/ProtocolState'
import FidelityMeter from '@/components/aeon/FidelityMeter'
import { ChatResponse, DisplayStatus } from '@/lib/aeon-types'

export default function AeonInterface() {
    const [mode, setMode] = useState<'rigorous' | 'exploratory' | 'hybrid'>('hybrid')
    const [fidelity, setFidelity] = useState(100)
    const [protocolStatus, setProtocolStatus] = useState<string>('ACTIVE')

    // Callback when the AI responds with new metadata
    const handleResponse = (data: ChatResponse) => {
        setFidelity(data.fidelity * 100)

        // Map display_status to our ProtocolState labels
        // We keep it simple: VERIFIED -> ACTIVE, PROTOCOL_BREACH -> BREACHED, UNVERIFIED -> STANDBY
        let status = 'ACTIVE'
        if (data.display_status === DisplayStatus.PROTOCOL_BREACH) status = 'BREACHED'
        else if (data.display_status === DisplayStatus.UNVERIFIED) status = 'STANDBY'
        else if (data.display_status === DisplayStatus.VERIFIED) status = 'SECURE'

        setProtocolStatus(status)
    }

    return (
        <CRTMonitor>
            <div className="flex flex-col h-full font-vt323 text-crt-amber p-2 md:p-4 max-w-7xl mx-auto">

                {/* Header / Top Bar */}
                <div className="border-b-2 border-crt-amber/50 pb-2 mb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold leading-none tracking-wider">PROJECT AEON</h1>
                        <div className="text-xs opacity-70">NEURAL INTERFACE // V.4.5 // SECURE</div>
                    </div>
                    <div className="text-right hidden md:block opacity-60">
                        <div className="text-xs">UPLINK: ACTIVE</div>
                        <div className="text-xs">LATENCY: 12ms</div>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[600px]">

                    {/* Left Panel: Status & Controls */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <ProtocolState status={protocolStatus as any} protocolId="OMEGA-4" />

                        <div className="border border-crt-amber/30 p-2 bg-black/40">
                            <div className="text-xs text-crt-amber/60 mb-2">OPERATION MODE</div>
                            <div className="flex flex-col gap-3">
                                {(['rigorous', 'exploratory', 'hybrid'] as const).map((m) => {
                                    const isSelected = mode === m
                                    return (
                                        <button
                                            key={m}
                                            onClick={() => setMode(m)}
                                            className={`group relative w-full px-4 py-4 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 border-2 clip-path-polygon flex items-center justify-between ${isSelected
                                                    ? 'bg-crt-amber/20 text-crt-amber border-crt-amber shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-[1.02]'
                                                    : 'bg-black/60 text-crt-amber/50 border-crt-amber/20 hover:border-crt-amber/60 hover:text-crt-amber hover:bg-crt-amber/5 hover:shadow-[0_0_10px_rgba(251,191,36,0.1)]'
                                                }`}
                                        >
                                            {/* Selection Indicator Icon */}
                                            <div className={`flex items-center transition-all duration-300 ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                                <span className="mr-2">►</span>
                                            </div>

                                            <span className={`relative z-10 flex-1 text-center transition-all duration-300 ${isSelected ? 'scale-110 text-shadow-glow' : ''}`}>
                                                {m}
                                            </span>

                                            {/* Status Light */}
                                            <span className={`w-2 h-2 rounded-full transition-all duration-300 ${isSelected ? 'bg-crt-amber shadow-[0_0_8px_rgba(251,191,36,1)]' : 'bg-crt-amber/10'}`} />

                                            {/* Corner accents */}
                                            <span className={`absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 transition-colors ${isSelected ? 'border-crt-amber opacity-100' : 'border-crt-amber/30 opacity-50'}`} />
                                            <span className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 transition-colors ${isSelected ? 'border-crt-amber opacity-100' : 'border-crt-amber/30 opacity-50'}`} />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="hidden lg:block flex-1 border border-crt-amber/10 bg-black/20 p-2 text-xs opacity-50 font-mono">
                            <div>&gt; SYSTEM LOGS:</div>
                            <div className="mt-2 space-y-1">
                                <div>[07:00:01] HANDSHAKE_OK</div>
                                <div>[07:00:02] KERNEL_LOADED</div>
                                <div>[07:00:05] PROOFS_READY</div>
                            </div>
                        </div>
                    </div>

                    {/* Center Panel: Chat Interface */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        {/* Top Bar: Fidelity */}
                        <FidelityMeter fidelity={fidelity} />

                        {/* Main Chat Window */}
                        <div className="flex-1 min-h-[400px]">
                            <ChatInterface mode={mode} onResponse={handleResponse} />
                        </div>
                    </div>

                </div>
            </div>
        </CRTMonitor>
    )
}
