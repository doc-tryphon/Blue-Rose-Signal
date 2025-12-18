'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CRTMonitor from '@/components/CRTMonitor'
import { CASE_FILES } from '@/lib/mainframe-data'

export default function CaseFilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const caseFile = CASE_FILES.find(c => c.id === id)

  if (!caseFile) {
    notFound()
  }

  const isWarning = caseFile.status === 'ACTIVE'

  return (
    <CRTMonitor>
      <div className="font-vt323 text-crt-amber max-w-4xl mx-auto pb-12">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm opacity-60 mb-6 border-b border-crt-amber/20 pb-2">
          <Link href="/" className="hover:text-white hover:underline">&lt; RETURN TO MAINFRAME</Link>
          <span>/</span>
          <span>CASE ARCHIVE</span>
          <span>/</span>
          <span className="text-white">{caseFile.id}</span>
        </div>

        {/* Case Header */}
        <div className={`border-l-4 p-6 mb-8 relative overflow-hidden ${isWarning ? 'border-red-500 bg-red-900/10' : 'border-green-500 bg-green-900/10'}`}>
          <div className="absolute top-0 right-0 p-2 text-xs font-bold border-b border-l border-crt-amber/20 bg-black/50">
            CLASSIFICATION: THRESHOLD-SENSITIVE
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-wider">
            {caseFile.codename}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm md:text-base opacity-90">
            <span className="bg-black/40 px-2 py-1 border border-crt-amber/30">
              ID: {caseFile.anomalyId}
            </span>
            <span className={`px-2 py-1 border font-bold ${isWarning ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
              STATUS: {caseFile.status}
            </span>
            <span className="bg-black/40 px-2 py-1 border border-crt-amber/30">
              CLASS: {caseFile.class}
            </span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">

            {/* BLUF */}
            <section>
              <h2 className="text-xl border-b border-crt-amber/40 mb-3 pb-1 flex items-center gap-2">
                <span className="text-red-500">🛑</span> BLUF (Bottom Line Up Front)
              </h2>
              <div className="bg-black/30 p-4 border border-crt-amber/20 text-lg leading-relaxed">
                {caseFile.summary}
              </div>
            </section>

            {/* Incident Log */}
            <section>
              <h2 className="text-xl border-b border-crt-amber/40 mb-4 pb-1 flex items-center gap-2">
                <span>📉</span> INCIDENT LOG
              </h2>
              <div className="space-y-4">
                {caseFile.events.map((event) => (
                  <div key={event.id} className="border-l-2 border-crt-amber/30 pl-4 py-1 hover:border-crt-amber transition-colors">
                    <div className="flex justify-between items-start mb-1 text-sm opacity-70">
                      <span className="font-mono">EVENT {event.id}</span>
                      <span>{event.date}</span>
                    </div>
                    <div className="font-bold text-lg mb-1">{event.type}</div>
                    <p className="mb-2 opacity-90">{event.description}</p>
                    <div className="text-sm bg-crt-amber/5 p-2 italic border-l-2 border-crt-amber/20">
                      <span className="font-bold not-italic text-xs block mb-1">ASSESSMENT:</span>
                      {event.assessment}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Mechanics & Hypotheses */}
            <section>
              <h2 className="text-xl border-b border-crt-amber/40 mb-4 pb-1 flex items-center gap-2">
                <span>⚙️</span> MECHANICS & HYPOTHESES
              </h2>
              <div className="grid gap-4">
                {caseFile.theories.map((theory, idx) => (
                  <div key={idx} className="bg-black/20 p-4 border border-crt-amber/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-crt-amber">{theory.name}:</span>
                      <span className="text-xs border border-crt-amber/40 px-1 rounded text-crt-amber/70">{theory.type}</span>
                    </div>
                    <p className="opacity-80">{theory.description}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Location Data */}
            <section className="bg-black/30 border border-crt-amber/30 p-4">
              <h3 className="text-sm font-bold opacity-60 mb-3 uppercase tracking-wider">Location Data</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs opacity-50">SECTOR</div>
                  <div className="text-xl font-bold">{caseFile.sector}</div>
                </div>
                <div>
                  <div className="text-xs opacity-50">SITE</div>
                  <div>{caseFile.location}</div>
                </div>
                <div>
                  <div className="text-xs opacity-50">LAST AUDIT</div>
                  <div className="font-mono">{caseFile.lastAudit}</div>
                </div>
              </div>
            </section>

            {/* Protocols */}
            <section>
              <h3 className="text-sm font-bold opacity-60 mb-3 uppercase tracking-wider border-b border-crt-amber/20 pb-1">
                Active Protocols
              </h3>
              <div className="space-y-3">
                {caseFile.protocols.map((protocol, idx) => (
                  <div key={idx} className="bg-red-900/10 border border-red-500/30 p-3">
                    <div className="font-bold text-red-400 mb-1 text-sm">{protocol.name}</div>
                    <div className="text-xs mb-2 opacity-80">{protocol.mandate}</div>
                    <div className="text-[10px] uppercase tracking-widest opacity-50 border-t border-red-500/20 pt-1">
                      Purpose: {protocol.purpose}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Actions */}
            <div className="pt-4 border-t border-crt-amber/20">
              <Link
                href="/spectrograph"
                className="block w-full text-center py-3 border border-crt-amber/50 hover:bg-crt-amber hover:text-black transition-all uppercase tracking-wider font-bold mb-2"
              >
                Analyze Signal
              </Link>
              <button disabled className="block w-full text-center py-3 border border-dashed border-crt-amber/30 opacity-50 cursor-not-allowed uppercase text-sm">
                Request Edit Access
              </button>
            </div>

          </div>
        </div>

      </div>
    </CRTMonitor>
  )
}
