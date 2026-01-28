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
                            <div className="space-y-1">
                                {(['rigorous', 'exploratory', 'hybrid'] as const).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMode(m)}
                                        className={`w-full text-left px-2 py-1 text-sm transition-colors border ${mode === m
                                                ? 'bg-crt-amber text-black border-crt-amber font-bold'
                                                : 'border-transparent hover:bg-crt-amber/10'
                                            }`}
                                    >
                                        [{mode === m ? 'x' : ' '}] {m.toUpperCase()}
                                    </button>
                                ))}
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
