'use client'

import { useState } from 'react'
import Link from 'next/link'
import CRTMonitor from '@/components/CRTMonitor'
import { SYSTEM_PROTOCOLS, CASE_FILES } from '@/lib/mainframe-data'

// Shared nav button styles
const navButtonBase = 'w-full md:w-auto px-4 py-3 md:px-3 md:py-1 text-left md:text-center uppercase tracking-wider transition-colors border border-crt-amber/50 md:border-0 bg-crt-amber/5 md:bg-transparent hover:bg-crt-amber/20'
const navButtonActive = 'bg-crt-amber text-black font-bold border-crt-amber'

// Terminal-style bracket wrapper (mobile only)
function TerminalLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="text-crt-amber/50 mr-2 md:hidden">[</span>
      {children}
      <span className="text-crt-amber/50 ml-2 md:hidden">]</span>
    </>
  )
}

export default function MainframeDashboard() {
  const [activeTab, setActiveTab] = useState<'STATUS' | 'PROTOCOLS' | 'CASES'>('STATUS')

  return (
    <CRTMonitor>
      <div className="font-vt323 text-crt-amber space-y-6 max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="border-b-2 border-crt-amber/50 pb-4 mb-6">
          <div className="text-xs md:text-sm text-crt-amber/70 mb-1">BLUE ROSE DIVISION // MAINFRAME</div>
          <div className="w-full bg-crt-amber/10 p-2 text-xs md:text-sm font-bold whitespace-pre-wrap leading-tight hidden md:block">
            {`████████████████████████████████████████████████████████████████
██  BLUE ROSE DIVISION  ██  OAK RIDGE FIELD OFFICE  ██  SEC-7  ██
████████████████████████████████████████████████████████████████`}
          </div>
          <div className="md:hidden text-xl font-bold border-2 border-crt-amber p-2 text-center">
            BLUE ROSE DIVISION
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-4 border-b border-crt-amber/30 pb-4 md:pb-2">
          <button
            onClick={() => setActiveTab('STATUS')}
            className={`${navButtonBase} ${activeTab === 'STATUS' ? navButtonActive : ''}`}
          >
            <TerminalLabel>System Status</TerminalLabel>
          </button>
          <button
            onClick={() => setActiveTab('PROTOCOLS')}
            className={`${navButtonBase} ${activeTab === 'PROTOCOLS' ? navButtonActive : ''}`}
          >
            <TerminalLabel>Active Protocols</TerminalLabel>
          </button>
          <button
            onClick={() => setActiveTab('CASES')}
            className={`${navButtonBase} ${activeTab === 'CASES' ? navButtonActive : ''}`}
          >
            <TerminalLabel>Case Archive</TerminalLabel>
          </button>
          <Link
            href="/mainframe/personnel/doc"
            className={`${navButtonBase} md:border-l md:border-crt-amber/30 md:pl-4 md:ml-2`}
          >
            <TerminalLabel>Personnel: DOC</TerminalLabel>
          </Link>
          <Link
            href="/spectrograph"
            className="w-full md:w-auto px-4 py-3 md:px-3 md:py-1 text-center uppercase tracking-wider transition-colors text-red-400 md:ml-auto border border-red-500/50 hover:border-red-500 hover:bg-red-900/30 bg-red-900/20 md:bg-transparent animate-pulse"
          >
            ▶ Launch Spectrograph
          </Link>
        </div>

        {/* CONTENT AREA */}
        <div className="min-h-[400px]">

          {/* SYSTEM STATUS VIEW */}
          {activeTab === 'STATUS' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-crt-amber/30 p-4 bg-black/40">
                  <h3 className="text-lg border-b border-crt-amber/30 mb-3 pb-1">DIAGNOSTICS</h3>
                  <div className="space-y-2 text-sm md:text-base">
                    <div className="flex justify-between">
                      <span>SYSTEM STATUS:</span>
                      <span className="text-green-400 animate-pulse">LIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ENTROPY INDEX:</span>
                      <span className="text-red-400">██████████░░ 78% (ELEVATED)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>THRESHOLD STABILITY:</span>
                      <span className="text-yellow-400">██████░░░░░░ 52% (UNSTABLE)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DEFCON STATUS:</span>
                      <span>3 - ROUND FORCE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LAST SYNC:</span>
                      <span>2024-12-14</span>
                    </div>
                  </div>
                </div>

                <div className="border border-crt-amber/30 p-4 bg-black/40">
                  <h3 className="text-lg border-b border-crt-amber/30 mb-3 pb-1">CASE SUMMARY</h3>
                  <div className="space-y-2 text-sm md:text-base">
                    <div className="flex justify-between">
                      <span>ACTIVE CASES:</span>
                      <span className="text-red-400 font-bold">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DORMANT CASES:</span>
                      <span>1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TOTAL CASES:</span>
                      <span>2</span>
                    </div>
                    <div className="mt-4 pt-2 border-t border-crt-amber/10 text-xs text-crt-amber/60">
                      WARNING: Unauthorized access to classified case files is a Class B felony under the Federal Bureau of Control charter.
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-crt-amber p-4 bg-crt-amber/5">
                <h3 className="font-bold mb-2">THRESHOLD WORK (n.)</h3>
                <p className="text-sm md:text-base leading-relaxed opacity-90">
                  The documentation, analysis, and containment of ontological anomalies, temporal distortions, and high-strangeness events occurring within or adjacent to consensus reality.
                  <br/><br/>
                  The Blue Rose Division operates under the assumption that the map is not the territory—and sometimes, the territory rewrites the map. We do not seek to explain. We seek to observe, document, and maintain coherence.
                </p>
              </div>
            </div>
          )}

          {/* PROTOCOLS VIEW */}
          {activeTab === 'PROTOCOLS' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {SYSTEM_PROTOCOLS.map((protocol) => (
                <div key={protocol.id} className="border border-crt-amber/30 p-4 bg-black/20 hover:bg-crt-amber/5 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-crt-amber text-black text-xs font-bold px-1">PROTOCOL {protocol.id}</span>
                    <h3 className="font-bold text-lg">{protocol.name}</h3>
                    <span className="ml-auto text-xs text-green-400 border border-green-900 px-2 py-0.5">{protocol.status}</span>
                  </div>

                  <div className="pl-4 border-l-2 border-crt-amber/20 space-y-2">
                    <div className="text-sm">
                      <span className="text-crt-amber/60 uppercase text-xs block">Mandate</span>
                      {protocol.mandate}
                    </div>

                    {protocol.purpose && (
                      <div className="text-sm">
                        <span className="text-crt-amber/60 uppercase text-xs block">Purpose</span>
                        {protocol.purpose}
                      </div>
                    )}

                    {protocol.subProtocols && (
                      <div className="mt-3 space-y-3 pt-2">
                        {protocol.subProtocols.map(sub => (
                          <div key={sub.id} className="bg-black/30 p-2">
                            <span className="text-crt-amber/80 font-bold block text-xs mb-1">{sub.id}: {sub.name}</span>
                            <span className="text-sm opacity-80">{sub.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CASE FILES VIEW */}
          {activeTab === 'CASES' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">CLASSIFIED CASE FILES</h3>
                <span className="text-xs text-crt-amber/60">ACCESS LEVEL: OPERATOR</span>
              </div>

              <div className="grid gap-4">
                {CASE_FILES.map((file) => (
                  <Link href={`/case/${file.id}`} key={file.id} className="block group">
                    <div className={`border p-4 transition-all duration-300 relative overflow-hidden ${
                      file.status === 'ACTIVE'
                        ? 'border-red-500/50 hover:border-red-500 hover:shadow-[0_0_15px_rgba(255,0,0,0.2)]'
                        : 'border-crt-amber/30 hover:border-crt-amber hover:shadow-[0_0_15px_rgba(255,204,0,0.2)]'
                    }`}>
                      {/* Scanline hover effect */}
                      <div className="absolute inset-0 bg-crt-amber/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none"/>

                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 relative z-10">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${
                          file.status === 'ACTIVE' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-green-500 shadow-[0_0_10px_green]'
                        }`}/>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{file.id}</span>
                            <span className="text-crt-amber/50">//</span>
                            <span className="font-bold">{file.codename}</span>
                          </div>
                          <div className="text-sm opacity-70 mt-1">{file.class}</div>
                        </div>

                        <div className="text-right text-sm opacity-60">
                          <div>{file.location}</div>
                          <div className="text-xs uppercase tracking-wider mt-1">{file.status}</div>
                        </div>

                        <div className="hidden md:block text-2xl opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                          &gt;
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 border-t border-crt-amber/20 pt-4 text-center opacity-50">
                <div className="text-sm mb-2">📋 NEW CASE TEMPLATE</div>
                <div className="text-xs border border-dashed border-crt-amber/30 p-2 inline-block">
                  COPY TEMPLATE FOR NEW CASES
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="border-t border-crt-amber/30 pt-4 mt-8 text-center text-xs opacity-60">
          FEDERAL BUREAU OF CONTROL // BLUE ROSE DIVISION
          <br/>
          <span className="italic">"The owls are not what they seem."</span>
        </div>

      </div>
    </CRTMonitor>
  )
}
