'use client'

type ProtocolStatus = 'ACTIVE' | 'STANDBY' | 'BREACHED' | 'LOCKED'

interface ProtocolStateProps {
    status?: ProtocolStatus
    protocolId?: string
}

export default function ProtocolState({ status = 'ACTIVE', protocolId = 'OMEGA-4' }: ProtocolStateProps) {
    const getStatusColor = (s: ProtocolStatus) => {
        switch (s) {
            case 'ACTIVE': return 'text-green-400'
            case 'BREACHED': return 'text-red-500 animate-pulse'
            case 'LOCKED': return 'text-crt-amber/50'
            case 'STANDBY': return 'text-crt-amber'
        }
    }

    return (
        <div className="border border-crt-amber/30 p-2 bg-black/40">
            <div className="text-xs text-crt-amber/60 mb-1">PROTOCOL STATE</div>

            <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                    <span>ORDINAL:</span>
                    <span className="font-bold">{protocolId}</span>
                </div>

                <div className="flex justify-between text-sm border-t border-crt-amber/20 pt-1 mt-1">
                    <span>STATUS:</span>
                    <span className={`font-bold ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </div>
            </div>

            {status === 'BREACHED' && (
                <div className="mt-2 text-xs bg-red-900/20 border border-red-500/50 text-red-400 p-1 text-center animate-pulse">
                    ⚠ CONTAINMENT FAILURE
                </div>
            )}
        </div>
    )
}
